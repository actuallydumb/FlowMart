import { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Zap,
  Briefcase,
  GraduationCap,
  Globe,
  Heart,
  Rocket,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Careers - WorkflowHub",
  description:
    "Join our team and help shape the future of workflow automation.",
};

const jobOpenings = [
  {
    id: "1",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $180k",
    experience: "5+ years",
    description:
      "We're looking for a Senior Full-Stack Engineer to help build and scale our workflow automation platform.",
    requirements: [
      "Strong experience with React, TypeScript, and Node.js",
      "Experience with cloud platforms (AWS, GCP, or Azure)",
      "Knowledge of database design and optimization",
      "Experience with microservices architecture",
    ],
    benefits: [
      "Competitive salary and equity",
      "Flexible remote work policy",
      "Health, dental, and vision insurance",
      "Professional development budget",
    ],
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$130k - $190k",
    experience: "3+ years",
    description:
      "Lead product strategy and execution for our workflow automation marketplace.",
    requirements: [
      "Experience in B2B SaaS product management",
      "Strong analytical and problem-solving skills",
      "Experience with user research and data analysis",
      "Excellent communication and leadership skills",
    ],
    benefits: [
      "Competitive salary and equity",
      "Flexible work arrangements",
      "Comprehensive health benefits",
      "Annual team retreats",
    ],
  },
  {
    id: "3",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$110k - $160k",
    experience: "4+ years",
    description:
      "Help us build and maintain a robust, scalable infrastructure for our platform.",
    requirements: [
      "Experience with Kubernetes and Docker",
      "Knowledge of AWS or similar cloud platforms",
      "Experience with CI/CD pipelines",
      "Strong scripting skills (Python, Bash)",
    ],
    benefits: [
      "Competitive salary and equity",
      "Remote-first culture",
      "Health and wellness benefits",
      "Learning and development opportunities",
    ],
  },
  {
    id: "4",
    title: "UX/UI Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $150k",
    experience: "3+ years",
    description:
      "Create beautiful, intuitive user experiences for our workflow automation platform.",
    requirements: [
      "Strong portfolio demonstrating UX/UI skills",
      "Experience with design systems and component libraries",
      "Proficiency in Figma and design tools",
      "Understanding of user research and testing",
    ],
    benefits: [
      "Competitive salary and equity",
      "Flexible work arrangements",
      "Design tools and software provided",
      "Conference and workshop attendance",
    ],
  },
  {
    id: "5",
    title: "Sales Development Representative",
    department: "Sales",
    location: "Remote",
    type: "Full-time",
    salary: "$60k - $80k + commission",
    experience: "1+ years",
    description:
      "Help us grow our customer base by identifying and qualifying new business opportunities.",
    requirements: [
      "Experience in B2B sales or SDR role",
      "Strong communication and interpersonal skills",
      "Ability to work in a fast-paced environment",
      "Experience with CRM systems (Salesforce preferred)",
    ],
    benefits: [
      "Competitive base salary + commission",
      "Remote work flexibility",
      "Health and dental insurance",
      "Career growth opportunities",
    ],
  },
  {
    id: "6",
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    salary: "$80k - $120k",
    experience: "2+ years",
    description:
      "Ensure our customers achieve success with our workflow automation platform.",
    requirements: [
      "Experience in customer success or account management",
      "Strong problem-solving and communication skills",
      "Experience with SaaS products",
      "Ability to manage multiple customer relationships",
    ],
    benefits: [
      "Competitive salary and equity",
      "Remote work environment",
      "Health and wellness benefits",
      "Professional development opportunities",
    ],
  },
];

const departments = [
  { name: "All", count: jobOpenings.length },
  { name: "Engineering", count: 2 },
  { name: "Product", count: 1 },
  { name: "Design", count: 1 },
  { name: "Sales", count: 1 },
  { name: "Customer Success", count: 1 },
];

const values = [
  {
    icon: Zap,
    title: "Innovation First",
    description:
      "We're constantly pushing boundaries and exploring new technologies.",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    description:
      "We believe the best ideas come from working together as a team.",
  },
  {
    icon: Target,
    title: "Customer Focused",
    description:
      "Everything we do is centered around helping our customers succeed.",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description:
      "We support flexible schedules and prioritize your well-being.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Briefcase className="h-4 w-4 mr-2" />
              Careers
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
              Join Our Mission
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Help us democratize workflow automation and build the future of
              business efficiency.
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Why Work With Us
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Our values shape everything we do and how we work together
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Benefits & Perks
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              We take care of our team with comprehensive benefits and perks
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="p-3 bg-primary/10 rounded-lg w-fit">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Competitive Compensation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Competitive salary, equity, and performance bonuses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="p-3 bg-primary/10 rounded-lg w-fit">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Remote-First Culture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Work from anywhere with flexible schedules.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="p-3 bg-primary/10 rounded-lg w-fit">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Learning & Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Budget for courses, conferences, and professional development.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="p-3 bg-primary/10 rounded-lg w-fit">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Health & Wellness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Comprehensive health, dental, and vision insurance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="p-3 bg-primary/10 rounded-lg w-fit">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Career Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Clear career paths and opportunities for advancement.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="p-3 bg-primary/10 rounded-lg w-fit">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Team Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Regular team building activities and annual retreats.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Search */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Open Positions
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect role for your skills and career goals
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8 sm:mb-12">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs..."
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
              {departments.map((dept) => (
                <Badge
                  key={dept.name}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {dept.name} ({dept.count})
                </Badge>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <Card
                key={job.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Badge variant="secondary">{job.department}</Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </div>
                      </div>
                      <CardTitle className="text-xl sm:text-2xl leading-tight">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {job.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-start lg:items-end gap-2">
                      <div className="text-lg font-semibold text-primary">
                        {job.salary}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {job.experience} experience
                      </div>
                      <Button asChild>
                        <Link href={`/careers/${job.id}`}>Apply Now</Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl sm:text-3xl">
                Don't See the Right Fit?
              </CardTitle>
              <CardDescription className="text-lg">
                We're always looking for talented individuals to join our team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Send us your resume and let us know how you can contribute to
                  our mission.
                </p>
                <Button size="lg">Send General Application</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
