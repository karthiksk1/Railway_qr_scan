import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import QRScannerModal from '@/components/dashboard/QRScannerModal';
import { SuccessUIDDialog } from '@/components/dashboard/SuccessUIDDialog';
import { InstallationFormValues } from '@/lib/validations';

type UserRole = 'admin' | 'inspector' | 'vendor';

interface ModalContextType {
  openScanner: (role: UserRole) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('vendor'); // Default role
  const [newlyGeneratedUID, setNewlyGeneratedUID] = useState<string | null>(null);

  const openScanner = (role: UserRole) => { setCurrentUserRole(role); setScannerOpen(true); };
  const closeScanner = () => setScannerOpen(false);

  const handleSaveInstallation = (installationData: InstallationFormValues) => {
    closeScanner();

    const promise = (async () => {
      const formData = new FormData();
      Object.entries(installationData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetch("/api/installations", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save installation.');
      }

      return await response.json();
    })();

    toast.promise(promise, {
      loading: 'Saving installation data...',
      success: (data) => {
        setNewlyGeneratedUID(data.record.uid);
        return `Installation saved with UID: ${data.record.uid}`;
      },
      error: (err) => err.message || 'An error occurred during processing.',
    });
  };

  return (
    <ModalContext.Provider value={{ openScanner }}>
      {children}
      <QRScannerModal isOpen={isScannerOpen} onClose={closeScanner} onSave={handleSaveInstallation} userRole={currentUserRole} />
      {newlyGeneratedUID && (
        <SuccessUIDDialog
          isOpen={!!newlyGeneratedUID}
          onClose={() => setNewlyGeneratedUID(null)}
          uid={newlyGeneratedUID}
        />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};