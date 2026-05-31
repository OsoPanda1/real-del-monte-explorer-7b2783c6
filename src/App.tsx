import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex items-center justify-center bg-rdm-night p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <Card className="backdrop-blur-xl bg-rdm-night/80 border-rdm-gold/30">
          <CardContent className="py-12 px-8 text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rdm-gold/20 to-rdm-copper/20 border-2 border-rdm-gold/40"
            >
              <AlertTriangle className="w-10 h-10 text-rdm-gold" />
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-rdm-gold to-rdm-copper bg-clip-text text-transparent">
                Algo salió mal
              </h1>
              <p className="text-rdm-fog/70 max-w-md mx-auto">
                Ocurrió un error inesperado. Puedes intentar recargar la página o volver al inicio.
              </p>
            </div>

            {isDev && (
              <div className="text-left bg-rdm-night/50 rounded-lg p-4 max-w-full overflow-auto">
                <p className="text-xs font-mono text-red-400 mb-2">Error (dev only):</p>
                <pre className="text-xs text-rdm-fog/60 whitespace-pre-wrap break-words">
                  {error.message}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={resetErrorBoundary}
                size="lg"
                className="bg-gradient-to-r from-rdm-gold to-rdm-copper hover:opacity-90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
              <Button asChild variant="outline" size="lg" className="border-rdm-gold/40">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Ir al inicio
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ErrorFallback;
