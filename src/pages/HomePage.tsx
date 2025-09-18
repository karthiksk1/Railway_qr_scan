import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  FileText,
  Link as LinkIcon,
  ChevronRight,
  LayoutGrid,
  Gavel,
} from "lucide-react";
import ImageCarousel from "@/components/ui/ImageCarousel";

const announcements = [
  { id: 5, text: "New digital signature (DSC) requirements for all tenders submitted via TMS, effective from 1st December 2023.", date: "2023-11-05" },
  { id: 6, text: "Enhancements to the User Depot Module (UDM) for improved stock verification are now live.", date: "2023-11-02" },
  { id: 1, text: "Introduction of new Vande Bharat Express on the Mumbai-Pune route.", date: "2023-10-26" },
  { id: 2, text: "Scheduled maintenance on the Northern Line from 1st to 5th November.", date: "2023-10-25" },
  { id: 3, text: "E-ticketing services will be temporarily unavailable on Oct 28th from 2 AM to 4 AM.", date: "2023-10-24" },
  { id: 4, text: "Special trains announced for the upcoming festival season.", date: "2023-10-23" },
];

const notices = [
  { id: 1, text: "Tender Notice for Supply of Rolling Stock Components.", link: "#" },
  { id: 2, text: "Recruitment Notification for Junior Engineer positions.", link: "#" },
  { id: 3, text: "Auction notice for scrap materials at various depots.", link: "#" },
];

const quickLinks = [
  { title: "UDM", icon: LayoutGrid, path: "https://www.ireps.gov.in/", color: "blue" },
  { title: "TMS", icon: Gavel, path: "https://ircep.gov.in/TMS/", color: "amber" },
];

const HomePage = () => {
  return (
    <div className="space-y-8">
      {/* Full-width rotating image carousel */}
      <div className="w-full -mt-4 md:mt-0 rounded-lg overflow-hidden shadow-rail-md">
        <ImageCarousel />
      </div>
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column: Announcements and Notices */}
        <div className="lg:col-span-2 space-y-8">
          {/* Announcements Section */}
          <Card className="shadow-rail-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-slate-800">
                <div className="p-2 bg-amber-100 rounded-lg mr-4">
                  <Megaphone className="h-6 w-6 text-amber-600" />
                </div>
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {announcements.map((ann) => (
                  <li key={ann.id} className="border-l-4 border-primary/50 pl-4 py-1 hover:bg-muted/50 transition-colors">
                    <p className="font-medium text-foreground">{ann.text}</p>
                    <p className="text-xs text-muted-foreground">{new Date(ann.date).toLocaleDateString('en-GB')}</p>
                  </li>
                ))}
              </ul>
              <Button variant="link" className="mt-4 px-0">
                View All Announcements
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Notices Section */}
          <Card className="shadow-rail-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-slate-800">
                <div className="p-2 bg-emerald-100 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                Notices & Tenders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {notices.map(notice => (
                  <li key={notice.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md hover:bg-accent transition-colors">
                    <p className="font-semibold text-foreground">{notice.text}</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={notice.link} target="_blank" rel="noopener noreferrer">View PDF <ChevronRight className="ml-1 h-4 w-4" /></a>
                    </Button>
                  </li>
                ))}
              </ul>
              <Button variant="link" className="mt-4 px-0">View All Notices <ChevronRight className="ml-1 h-4 w-4" /></Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Quick Links */}
        <div className="lg:col-span-1">
          <Card className="shadow-rail-sm sticky top-40">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-slate-800">
                <div className="p-2 bg-sky-100 rounded-lg mr-4">
                  <LinkIcon className="h-6 w-6 text-sky-600" />
                </div>
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {quickLinks.map(link => {
                  const colorClasses: { [key: string]: string } = {
                    blue: "bg-blue-100 text-blue-700",
                    amber: "bg-amber-100 text-amber-700",
                    emerald: "bg-emerald-100 text-emerald-700",
                    sky: "bg-sky-100 text-sky-700",
                    violet: "bg-violet-100 text-violet-700",
                  };
                  return (
                    <li key={link.title}>
                      <Link
                        to={link.path}
                        className="flex items-center text-foreground p-2 rounded-lg transition-colors hover:bg-accent group"
                      >
                        <div
                          className={`mr-4 p-3 rounded-lg transition-colors group-hover:bg-primary/10 ${
                            colorClasses[link.color]
                          }`}
                        >
                          <link.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{link.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;