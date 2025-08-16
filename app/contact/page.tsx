"use client";

import { useState } from "react";
import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@workflowhub.com",
    description: "We'll get back to you within 24 hours",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri from 9am to 6pm PST",
  },
  {
    icon: MapPin,
    title: "Office",
    value: "San Francisco, CA",
    description: "Visit us in our downtown office",
  },
  {
    icon: Clock,
    title: "Response Time",
    value: "24 hours",
    description: "We typically respond within one business day",
  },
];

const faqs = [
  {
    question: "How do I get started with WorkflowHub?",
    answer:
      "Sign up for an account, complete the onboarding process, and start exploring workflows in our marketplace.",
  },
  {
    question: "What types of workflows can I find?",
    answer:
      "We offer workflows for marketing automation, data processing, customer service, and much more.",
  },
  {
    question: "How does the pricing work?",
    answer:
      "Workflows are priced individually by their creators. You pay once and get lifetime access to the workflow.",
  },
  {
    question: "Can I create and sell my own workflows?",
    answer:
      "Yes! Developers can create and sell workflows after completing our verification process.",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Us
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl sm:text-2xl">
                    Send us a Message
                  </CardTitle>
                  <CardDescription className="text-base">
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name *
                        </label>
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder="Your name"
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="your@email.com"
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        {...register("subject")}
                        placeholder="What's this about?"
                        className={errors.subject ? "border-red-500" : ""}
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-500">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        {...register("message")}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        className={errors.message ? "border-red-500" : ""}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Status */}
                    {submitStatus === "success" && (
                      <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="text-green-800">
                          Message sent successfully! We'll get back to you soon.
                        </p>
                      </div>
                    )}

                    {submitStatus === "error" && (
                      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <p className="text-red-800">
                          Failed to send message. Please try again.
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  We're here to help and answer any questions you might have. We
                  look forward to hearing from you.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{info.title}</h3>
                      <p className="text-primary font-medium">{info.value}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Office Hours */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Office Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">
                        10:00 AM - 4:00 PM PST
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg leading-tight">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl sm:text-3xl">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of businesses already automating their workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/marketplace">Explore Workflows</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/auth/signup">Create Account</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
