
import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { SearchBar } from "./SearchBar";
import { Bell, User, X } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LayoutProps = {
  children: ReactNode;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Low Stock Alert",
    message: "5 products are running low on stock and need replenishment.",
    time: "10 minutes ago",
    read: false
  },
  {
    id: "notif-2",
    title: "New Order Received",
    message: "Order #ORD-238 has been placed and requires processing.",
    time: "2 hours ago",
    read: false
  }
];

export function Layout({ children }: LayoutProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleReadNotification = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  const handleClearNotifications = () => {
    setNotifications([]);
    setIsNotificationsOpen(false);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been cleared.",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <SearchBar />
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="relative" 
                onClick={() => setIsNotificationsOpen(true)}
                aria-label="Notifications"
              >
                <Bell size={20} className="text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center" aria-label="User menu">
                  <User size={20} className="text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" x2="18" y1="1" y2="1"></line>
                    <line x1="6" x2="18" y1="16" y2="16"></line>
                  </svg>
                  <span>Email: admin@inventoryvista.com</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" x2="9" y1="12" y2="12"></line>
                  </svg>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Notifications Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Notifications</DialogTitle>
              {notifications.length > 0 && (
                <button 
                  onClick={handleClearNotifications}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
            </div>
          </DialogHeader>
          <div className="py-4">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No notifications</p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border rounded-md relative ${notification.read ? 'bg-white' : 'bg-purple-50'}`}
                    onClick={() => handleReadNotification(notification.id)}
                  >
                    <div className="flex justify-between">
                      <h4 className="text-sm font-semibold">{notification.title}</h4>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotifications(notifications.filter(n => n.id !== notification.id));
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    {!notification.read && (
                      <div className="absolute top-3 right-3 w-2 h-2 bg-purple-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
