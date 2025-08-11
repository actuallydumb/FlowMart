"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  CreditCard,
  Building,
  Mail,
  AlertCircle,
  Shield,
  Lock,
} from "lucide-react";

interface SellerStep2Props {
  onNext: (data: any) => void;
  onPrevious: () => void;
  isSaving: boolean;
}

export default function SellerStep2({
  onNext,
  onPrevious,
  isSaving,
}: SellerStep2Props) {
  const [formData, setFormData] = useState({
    bankAccountName: "",
    bankAccountNumber: "",
    bankRoutingNumber: "",
    paypalEmail: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bankAccountName.trim()) {
      newErrors.bankAccountName = "Bank account name is required";
    }

    if (!formData.bankAccountNumber.trim()) {
      newErrors.bankAccountNumber = "Bank account number is required";
    } else if (
      !/^\d{8,17}$/.test(formData.bankAccountNumber.replace(/\s/g, ""))
    ) {
      newErrors.bankAccountNumber = "Please enter a valid bank account number";
    }

    if (!formData.bankRoutingNumber.trim()) {
      newErrors.bankRoutingNumber = "Bank routing number is required";
    } else if (!/^\d{9}$/.test(formData.bankRoutingNumber.replace(/\s/g, ""))) {
      newErrors.bankRoutingNumber =
        "Please enter a valid 9-digit routing number";
    }

    if (formData.paypalEmail && !isValidEmail(formData.paypalEmail)) {
      newErrors.paypalEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    onNext({
      step: 2,
      bankAccountName: formData.bankAccountName.trim(),
      bankAccountNumber: formData.bankAccountNumber.replace(/\s/g, ""),
      bankRoutingNumber: formData.bankRoutingNumber.replace(/\s/g, ""),
      paypalEmail: formData.paypalEmail.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Payment Information</h3>
        <p className="text-muted-foreground">
          Set up your payment details to receive earnings from workflow sales.
          Your information is encrypted and secure.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label
            htmlFor="bankAccountName"
            className="flex items-center space-x-2"
          >
            <Building className="h-4 w-4" />
            <span>Account Holder Name *</span>
          </Label>
          <Input
            id="bankAccountName"
            value={formData.bankAccountName}
            onChange={(e) =>
              handleInputChange("bankAccountName", e.target.value)
            }
            placeholder="Name on bank account"
            className={errors.bankAccountName ? "border-red-500" : ""}
          />
          {errors.bankAccountName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.bankAccountName}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="bankAccountNumber"
            className="flex items-center space-x-2"
          >
            <CreditCard className="h-4 w-4" />
            <span>Bank Account Number *</span>
          </Label>
          <Input
            id="bankAccountNumber"
            type="password"
            value={formData.bankAccountNumber}
            onChange={(e) =>
              handleInputChange("bankAccountNumber", e.target.value)
            }
            placeholder="Enter account number"
            className={errors.bankAccountNumber ? "border-red-500" : ""}
          />
          {errors.bankAccountNumber && (
            <p className="text-sm text-red-500 mt-1">
              {errors.bankAccountNumber}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="bankRoutingNumber"
            className="flex items-center space-x-2"
          >
            <CreditCard className="h-4 w-4" />
            <span>Bank Routing Number *</span>
          </Label>
          <Input
            id="bankRoutingNumber"
            type="password"
            value={formData.bankRoutingNumber}
            onChange={(e) =>
              handleInputChange("bankRoutingNumber", e.target.value)
            }
            placeholder="9-digit routing number"
            className={errors.bankRoutingNumber ? "border-red-500" : ""}
          />
          {errors.bankRoutingNumber && (
            <p className="text-sm text-red-500 mt-1">
              {errors.bankRoutingNumber}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="paypalEmail" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>PayPal Email (Optional)</span>
          </Label>
          <Input
            id="paypalEmail"
            type="email"
            value={formData.paypalEmail}
            onChange={(e) => handleInputChange("paypalEmail", e.target.value)}
            placeholder="your-email@example.com"
            className={errors.paypalEmail ? "border-red-500" : ""}
          />
          {errors.paypalEmail && (
            <p className="text-sm text-red-500 mt-1">{errors.paypalEmail}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Alternative payment method for international sellers
          </p>
        </div>
      </div>

      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Your data is secure</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                All payment information is encrypted and stored securely. We use
                bank-level security to protect your sensitive data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Payment Schedule</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                You'll receive payments monthly for all sales made in the
                previous month. Minimum payout amount is $50.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onPrevious} disabled={isSaving}>
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={isSaving}
          className="min-w-[100px]"
        >
          {isSaving ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
