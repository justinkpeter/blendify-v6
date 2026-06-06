import Tooltip from "@/components/Tooltip/Tooltip";
import { Music, User, DiscAlbum } from "lucide-react";

export const TABS = [
  {
    label: (
      <Tooltip text="Show top tracks" shortcut="T">
        <Music strokeWidth={1.5} />
      </Tooltip>
    ),
    value: "Top Tracks",
  },
  {
    label: (
      <Tooltip text="Show top artists" shortcut="A">
        <User strokeWidth={1.5} />
      </Tooltip>
    ),
    value: "Top Artists",
  },
  {
    label: (
      <Tooltip text="Show top genres" shortcut="G">
        <DiscAlbum strokeWidth={1.5} />
      </Tooltip>
    ),
    value: "Top Genres",
  },
];
