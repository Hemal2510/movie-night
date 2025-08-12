import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import JoinGroup from "./JoinGroup";

export default function JoinGroupDialog() {
  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-yellow-400 text-black hover:bg-yellow-300 border-none"
        >
          🔍 Join Group
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-black ">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-yellow-400">
            Join a Movie Group
          </DialogTitle>
        </DialogHeader>

        <JoinGroup />
      </DialogContent>
    </Dialog>
  );
}
