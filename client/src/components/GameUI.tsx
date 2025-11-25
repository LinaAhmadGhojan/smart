import { useSettlement, BUILDING_COSTS, type BuildingType } from "@/lib/stores/useSettlement";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useAudio } from "@/lib/stores/useAudio";

export function GameUI() {
  const {
    resources,
    selectedBuildingType,
    selectBuildingType,
    canAffordBuilding,
    timeOfDay,
    phase,
    setPhase,
  } = useSettlement();
  
  const { isMuted, toggleMute } = useAudio();

  const getTimeOfDayLabel = (time: number) => {
    if (time < 0.25) return "🌙 Night";
    if (time < 0.5) return "🌅 Morning";
    if (time < 0.75) return "☀️ Day";
    return "🌇 Evening";
  };

  const buildings: { type: BuildingType; name: string; emoji: string; description: string }[] = [
    { type: "home", name: "Home", emoji: "🏠", description: "Houses +5 people" },
    { type: "farm", name: "Farm", emoji: "🌾", description: "Produces food" },
    { type: "workshop", name: "Workshop", emoji: "🔨", description: "Generates resources" },
    { type: "well", name: "Well", emoji: "💧", description: "Increases happiness" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top Bar - Resources */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <Card className="bg-black/70 text-white px-6 py-3 backdrop-blur-sm">
          <div className="flex gap-6 items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">🪵</span>
              <span className="font-bold">{Math.floor(resources.wood)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">🪨</span>
              <span className="font-bold">{Math.floor(resources.stone)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">🌾</span>
              <span className="font-bold">{Math.floor(resources.food)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">👥</span>
              <span className="font-bold">{resources.population}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pink-400">😊</span>
              <span className="font-bold">{Math.floor(resources.happiness)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Time of Day */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <Card className="bg-black/70 text-white px-4 py-2 backdrop-blur-sm">
          <div className="text-sm font-medium">
            {getTimeOfDayLabel(timeOfDay)}
          </div>
        </Card>
      </div>

      {/* Sound Toggle */}
      <div className="absolute top-20 right-4 pointer-events-auto">
        <Button
          onClick={toggleMute}
          variant="secondary"
          size="sm"
          className="bg-black/70 text-white hover:bg-black/90"
        >
          {isMuted ? "🔇 Unmute" : "🔊 Mute"}
        </Button>
      </div>

      {/* Building Menu */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <Card className="bg-black/70 text-white p-4 backdrop-blur-sm">
          <div className="text-xs mb-3 text-center text-gray-300">
            {selectedBuildingType ? "Click on the terrain to place" : "Select a building to place"}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {buildings.map((building) => {
              const cost = BUILDING_COSTS[building.type];
              const canAfford = canAffordBuilding(building.type);
              const isSelected = selectedBuildingType === building.type;

              return (
                <Button
                  key={building.type}
                  onClick={() => selectBuildingType(isSelected ? null : building.type)}
                  variant={isSelected ? "default" : "secondary"}
                  disabled={!canAfford && !isSelected}
                  className={`flex flex-col items-center gap-1 h-auto py-3 ${
                    isSelected ? "ring-2 ring-blue-400" : ""
                  } ${!canAfford && !isSelected ? "opacity-50" : ""}`}
                >
                  <span className="text-2xl">{building.emoji}</span>
                  <span className="text-xs font-semibold">{building.name}</span>
                  <div className="text-[10px] text-gray-300 mt-1">
                    <div>🪵{cost.wood} 🪨{cost.stone}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Pause Menu */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <Button
          onClick={() => setPhase(phase === "playing" ? "paused" : "playing")}
          variant="secondary"
          size="sm"
          className="bg-black/70 text-white hover:bg-black/90"
        >
          {phase === "paused" ? "▶️ Resume" : "⏸️ Pause"}
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <Card className="bg-black/70 text-white/80 px-3 py-2 backdrop-blur-sm text-xs max-w-xs">
          <p className="mb-1"><strong>Goal:</strong> Build a thriving, sustainable community</p>
          <p><strong>Tip:</strong> Balance resource production with population needs</p>
        </Card>
      </div>
    </div>
  );
}
