import { useSettlement } from "@/lib/stores/useSettlement";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

export function MainMenu() {
  const { setPhase } = useSettlement();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-amber-50 to-green-100">
      <Card className="w-full max-w-lg mx-4 shadow-2xl">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <CardTitle className="text-4xl font-bold text-amber-900">
            Heritage Village
          </CardTitle>
          <CardDescription className="text-lg mt-2 text-amber-700">
            Build a sustainable historical community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-xl">🏠</span>
              <p><strong>Build homes</strong> to house your growing population</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🌾</span>
              <p><strong>Create farms</strong> to produce food for your people</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🔨</span>
              <p><strong>Construct workshops</strong> to gather wood and stone</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">💧</span>
              <p><strong>Dig wells</strong> to increase community happiness</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-900">
              <strong>🌍 Sustainability:</strong> Watch the day-night cycle and manage your resources wisely. 
              Balance growth with the well-being of your community for long-term prosperity.
            </p>
          </div>

          <Button
            onClick={() => setPhase("playing")}
            size="lg"
            className="w-full text-lg bg-amber-600 hover:bg-amber-700"
          >
            Start Building
          </Button>

          <p className="text-xs text-center text-gray-500">
            Click buildings to place them. Watch your resources in the top bar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
