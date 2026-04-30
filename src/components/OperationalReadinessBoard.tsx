import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock3, CircleDashed, Target } from "lucide-react";
import {
  readinessDomains,
  getReadinessProgress,
  getMilestoneProgress,
  type ReadinessStatus,
} from "@/lib/operational-readiness";

const statusLabel: Record<ReadinessStatus, string> = {
  backlog: "Backlog",
  in_progress: "En progreso",
  done: "Listo",
};

const statusClass: Record<ReadinessStatus, string> = {
  backlog: "bg-muted text-muted-foreground border-border",
  in_progress: "bg-secondary text-secondary-foreground border-border",
  done: "bg-primary/15 text-primary border-primary/40",
};

const statusIcon: Record<ReadinessStatus, JSX.Element> = {
  backlog: <CircleDashed className="h-3.5 w-3.5" />,
  in_progress: <Clock3 className="h-3.5 w-3.5" />,
  done: <CheckCircle2 className="h-3.5 w-3.5" />,
};

export function OperationalReadinessBoard() {
  const global = getReadinessProgress(readinessDomains);
  const stage = getMilestoneProgress(readinessDomains, "stage");
  const prod = getMilestoneProgress(readinessDomains, "production");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Centro de Preparación Operativa
          </CardTitle>
          <CardDescription>
            Estado consolidado para pasar de beta privada a stage semi-real y producción pública.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {[
            { label: "Progreso global", value: global },
            { label: "Meta stage", value: stage },
            { label: "Meta producción", value: prod },
          ].map((m) => (
            <div key={m.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{m.label}</span>
                <span className="font-mono font-semibold">{m.value}%</span>
              </div>
              <Progress value={m.value} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {readinessDomains.map((domain) => (
          <Card key={domain.id}>
            <CardHeader>
              <CardTitle className="text-lg">{domain.label}</CardTitle>
              <CardDescription>{domain.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {domain.tasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Owner: {task.owner} · Milestone: {task.milestone}
                    </p>
                  </div>
                  <Badge variant="outline" className={`gap-1 ${statusClass[task.status]}`}>
                    {statusIcon[task.status]}
                    {statusLabel[task.status]}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
