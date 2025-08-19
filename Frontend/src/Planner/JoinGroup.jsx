import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function JoinGroup() {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [joinRequests, setJoinRequests] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("/api/groups/fetch-groups", {
          headers: { Authorization: `Bearer ${token}` },
        });
        let groupsData = [];
        if (Array.isArray(res.data)) {
          groupsData = res.data;
        } else if (Array.isArray(res.data.groups)) {
          groupsData = res.data.groups;
        } else if (Array.isArray(res.data.data)) {
          groupsData = res.data.data;
        }
        setGroups(groupsData);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    fetchGroups();
  }, [token]);

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
    const fetchSearchResults = async () => {
      try {
        const res = await axios.get(
          `/api/groups/search?query=${debouncedTerm}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        let resultsData = [];
        if (Array.isArray(res.data)) {
          resultsData = res.data;
        } else if (Array.isArray(res.data.groups)) {
          resultsData = res.data.groups;
        } else if (Array.isArray(res.data.data)) {
          resultsData = res.data.data;
        }

        console.log("parsed results", resultsData);

        setSearchResults(resultsData);
        console.log("search API raw response: ", res.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setSearchResults([]);
      }
    };
    fetchSearchResults();
  }, [debouncedTerm, token]);

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
            <p className="text-muted-foreground">
              No groups found for "{debouncedTerm}"
            </p>
          ) : (
            searchResults.map((group) => (
              <Card key={group._id} className="mb-3">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{group.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Group ID: {group.customId}
                      </p>
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
          {joinRequests.length === 0 ? (
            <p className="text-muted-foreground">
              You haven’t sent any join requests yet.
            </p>
          ) : (
            joinRequests.map((req) => (
              <Card key={req.id} className="mb-3">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{req.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Group ID: {req.id}
                      </p>
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
