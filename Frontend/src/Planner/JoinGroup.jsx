import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock group data (replace with API response)
const mockGroups = [
  { id: "G12345", name: "Weekend Movie Club", admin: "Aishani" },
  { id: "G54321", name: "Chill Fridays", admin: "Hemal" },
  { id: "G67890", name: "Tamil Gang", admin: "Ravi" },
];

// Mock join requests (will come from backend later)
const mockRequests = [
  { id: "G12345", name: "Weekend Movie Club", status: "Pending" },
  { id: "G54321", name: "Chill Fridays", status: "Accepted" },
  { id: "G99999", name: "Old Club", status: "Rejected" },
];

export default function JoinGroup() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // Debounce logic (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter groups when debounced search changes
  useEffect(() => {
    if (debouncedTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    const results = mockGroups.filter((group) =>
      group.name.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
      group.id.toLowerCase().includes(debouncedTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [debouncedTerm]);

  return (
    <div className="p-6 max-w-3xl mx-auto  ">
      <Tabs defaultValue="search" className="w-full  ">
        <TabsList className="mb-4 bg-yellow-400 text-black">
          <TabsTrigger value="search">Search Group</TabsTrigger>
          <TabsTrigger value="requests">My Join Requests</TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search">
          <Input
            type="text"
            placeholder="Search by group name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 text-white"
          />

          {searchResults.length === 0 && debouncedTerm ? (
            <p className="text-muted-foreground">No groups found for "{debouncedTerm}"</p>
          ) : (
            searchResults.map((group) => (
              <Card key={group.id} className="mb-3">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{group.name}</p>
                      <p className="text-sm text-muted-foreground">Group ID: {group.id}</p>
                      <p className="text-sm">Admin: {group.admin}</p>
                    </div>
                    <Button variant="default">Join</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* My Requests Tab */}
        <TabsContent value="requests">
          {mockRequests.length === 0 ? (
            <p className="text-muted-foreground">You haven’t sent any join requests yet.</p>
          ) : (
            mockRequests.map((req) => (
              <Card key={req.id} className="mb-3">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{req.name}</p>
                      <p className="text-sm text-muted-foreground">Group ID: {req.id}</p>
                    </div>
                    <Badge
                      variant={
                        req.status === "Accepted"
                          ? "default"
                          : req.status === "Rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {req.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
