import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Brain,
  Database,
  LineChart,
  Zap,
  Target,
  ArrowRight,
  Activity,
  Lock,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const features = [
  {
    icon: Brain,
    title: "Time-Series Analysis",
    description:
      "Powered by TimeGPT's predictive algorithms for sophisticated pattern recognition in network traffic.",
  },
  {
    icon: Database,
    title: "High-Performance Data Engine",
    description:
      "Fusion of Elasticsearch and InfluxDB for real-time data ingestion in a time-series manner.",
  },
  {
    icon: Activity,
    title: "Machine Learning",
    description:
      "Advanced anomaly detection with adaptive learning models like RNN, Pretrained Transformers, and RAG.",
  },
  {
    icon: LineChart,
    title: "Dynamic Visualization",
    description:
      "Interactive dashboards showing network threat landscapes with real-time graph analysis.",
  },
];

const objectives = [
  {
    icon: Target,
    title: "Advanced Threat Detection",
    description:
      "Developing an innovative network security framework that transcends traditional anomaly detection methodologies with unprecedented precision and speed.",
  },
  {
    icon: Clock,
    title: "Real-Time Analysis",
    description:
      "Utilizing InfluxDB for efficient time-series data storage, retrieval, and real-time analysis with robust data ingestion pipelines.",
  },
  {
    icon: Lock,
    title: "Intuitive Interface",
    description:
      "User-friendly dashboards enabling seamless data upload, comprehensive analysis, and threat exploration.",
  },
];

const techStack = [
  "TimeGPT",
  "LSTM Networks",
  "Transformers",
  "React",
  "FastAPI",
  "Express.js",
  "InfluxDB",
  "Elasticsearch",
];

export function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              <Zap className="h-3 w-3 mr-2" />
              Powered by TimeGPT & Advanced ML
            </Badge>

            {/* Main Heading */}
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="text-primary">AnomalyX</span>
                <span className="block mt-2 text-foreground">
                  Adaptive Threat Detection in Network Ecosystems
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                An advanced network security framework engineered for adaptive,
                near real-time threat detection, leveraging sophisticated
                machine learning and time-series analytics.
              </p>
            </div>

            {/* CTA Buttons - Auth Aware */}
            {!isLoading && (
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/analysis">
                    <Button size="lg" className="gap-2 px-8">
                      Go to Analysis
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="gap-2 px-8">
                        Get Started Free
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button
                        size="lg"
                        variant="outline"
                        className="gap-2 px-8"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Hero Image/Illustration */}
            <div className="relative mt-12 w-full max-w-4xl">
              <div className="relative rounded-xl border border-border/50 bg-linear-to-b from-muted/50 to-muted/30 p-8 shadow-2xl">
                <div className="absolute inset-0 bg-grid-white/5 rounded-xl" />
                <div className="relative flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-6 md:gap-12">
                    <div className="flex flex-col items-center space-y-2 p-4">
                      <div className="rounded-full bg-primary/10 p-4">
                        <Shield className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-center">
                        Threat Detection
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 p-4">
                      <div className="rounded-full bg-chart-2/10 p-4">
                        <Brain className="h-8 w-8 text-chart-2" />
                      </div>
                      <span className="text-sm font-medium text-center">
                        ML Analysis
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 p-4">
                      <div className="rounded-full bg-chart-4/10 p-4">
                        <LineChart className="h-8 w-8 text-chart-4" />
                      </div>
                      <span className="text-sm font-medium text-center">
                        Visualization
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technology Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Core Technology Fusion
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combining cutting-edge technologies for comprehensive network
              security analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Objectives Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Key Objectives</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our mission to revolutionize network security through innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {objectives.map((objective, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                <Card className="relative h-full">
                  <CardHeader>
                    <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                      <objective.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle>{objective.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {objective.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Technology Stack</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern and reliable technologies
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-linear-to-r from-primary/10 via-primary/5 to-background border-primary/20">
            <CardContent className="p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Ready to Detect Anomalies?
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Upload your network data and let AnomalyX's powerful ML
                    algorithms identify potential threats in real-time.
                  </p>
                </div>
                {!isLoading &&
                  (isAuthenticated ? (
                    <Link to="/analysis">
                      <Button size="lg" className="gap-2 px-8">
                        Start Analysis
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/register">
                      <Button size="lg" className="gap-2 px-8">
                        Create Free Account
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
