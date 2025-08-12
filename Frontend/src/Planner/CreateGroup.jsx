// src/Planner/CreateGroup.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CreateGroup({ onSubmit }) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!groupName.trim()) return alert("Group name required!");

    const data = {
      name: groupName,
      description,
      // later add: selected dates, OTTs etc.
    };

    onSubmit(data);
    setOpen(false);
    setGroupName("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-400 text-black hover:bg-yellow-300">Create Group</Button>
      </DialogTrigger>

      <DialogContent className="bg-black border border-yellow-500 text-white">
        <DialogHeader>
          <DialogTitle className="text-yellow-400 text-xl">Create New Group</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Movie Maniacs"
              className="bg-white text-black"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="(optional)"
              className="bg-white text-black"
            />
          </div>

          <Button className="bg-yellow-400 text-black hover:bg-yellow-300" onClick={handleSubmit}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
