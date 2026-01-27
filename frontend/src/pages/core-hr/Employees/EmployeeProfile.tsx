import React, { useState, useEffect } from 'react';
import { Save, Upload, User, MapPin, Briefcase, CreditCard, ArrowRight, CheckCircle, ArrowLeft, FileText, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { employeeService, documentService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface FormData {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  
  // Identity and Bank Details
  countryCode: string; // ISO-2 country code

  // India specific fields
  aadhaar: string;
  pan: string;
  uan: string;
  esicNumber: string;
  pfAccountNumber: string;

  // US specific fields
  ssn: string;
  workAuthorizationType: string;
  visaExpiryDate: string;

  // UK specific fields
  nationalInsuranceNumber: string;
  rightToWorkStatus: string;

  // Generic international fields
  nationalIdNumber: string;
  workPermitNumber: string;
  visaType: string;

  // Common identity fields
  passport: string;
  drivingLicense: string;
  voterId: string;

  // Bank details - common
  bankAccountHolderName: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  payrollEnabled: boolean;

  // India bank fields
  ifscCode: string;
  upiId: string;

  // US bank fields
  routingNumber: string;
  bankAddress: string;
  achEnabled: boolean;

  // Europe/UK bank fields
  iban: string;
  swiftBic: string;

  // International bank fields
  swiftCode: string;
  bankCountry: string;
  
  // Address Details
  currentAddress: string;
  currentCity: string;
  currentState: string;
  currentPinCode: string;
  currentCountry: string;
  permanentAddress: string;
  permanentCity: string;
  permanentState: string;
  permanentPinCode: string;
  permanentCountry: string;
  sameAsCurrentAddress: boolean;
  
  // Professional Details
  employeeId: string;
  department: string;
  designation: string;
  reportingManager: string;
  joinDate: string;
  employmentType: string;
  workLocation: string;
  probationPeriod: string;
  experience: string;
  highestQualification: string;
  skillSet: string;
  highestSalary: string;
}

interface FormSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  fields: React.ReactNode;
}

const EmployeeProfile: React.FC = () => {
  const [activeSection, setActiveSection] = useState('basic');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  
  const isNewEmployee = id === 'new' || !id;
  const isFromOnboarding = searchParams.get('source') === 'onboarding';
  
  const [documentEntries, setDocumentEntries] = useState<Array<{id: string, name: string, file: File | null}>>([
    { id: '1', name: '', file: null }
  ]);

  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
    gender: '', maritalStatus: '', bloodGroup: '',
    countryCode: 'IN',
    aadhaar: '', pan: '', uan: '', esicNumber: '', pfAccountNumber: '',
    ssn: '', workAuthorizationType: '', visaExpiryDate: '',
    nationalInsuranceNumber: '', rightToWorkStatus: '',
    nationalIdNumber: '', workPermitNumber: '', visaType: '',
    passport: '', drivingLicense: '', voterId: '',
    bankAccountHolderName: '', bankName: '', accountNumber: '', accountType: 'savings', currency: 'INR', payrollEnabled: true,
    ifscCode: '', upiId: '',
    routingNumber: '', bankAddress: '', achEnabled: true,
    iban: '', swiftBic: '',
    swiftCode: '', bankCountry: '',
    currentAddress: '', currentCity: '', currentState: '', currentPinCode: '', currentCountry: 'India',
    permanentAddress: '', permanentCity: '', permanentState: '', permanentPinCode: '', permanentCountry: 'India', sameAsCurrentAddress: false,
    employeeId: '', department: '', designation: '', reportingManager: '',
    joinDate: '', employmentType: 'full-time', workLocation: 'office', probationPeriod: '6',
    experience: '', highestQualification: '', skillSet: '', highestSalary: ''
  });
  
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-copy current address to permanent when checkbox is checked
      if (field === 'sameAsCurrentAddress' && value === true) {
        updated.permanentAddress = prev.currentAddress;
        updated.permanentCity = prev.currentCity;
        updated.permanentState = prev.currentState;
        updated.permanentPinCode = prev.currentPinCode;
        updated.permanentCountry = prev.currentCountry;
      }
      
      return updated;
    });
  };
  
  const validateSection = (sectionId: string): boolean => {
    switch (sectionId) {
      case 'basic':
        const basicValid = !!(formData.firstName && formData.lastName && formData.email && formData.phone);
        if (!basicValid) console.log('Basic validation failed:', { firstName: !!formData.firstName, lastName: !!formData.lastName, email: !!formData.email, phone: !!formData.phone });
        return basicValid;
      case 'identity':
        let identityValid = !!formData.countryCode;

        // Country-specific identity validation
        if (formData.countryCode === 'IN') {
          identityValid = identityValid && !!(formData.aadhaar && formData.pan);
        } else if (formData.countryCode === 'US') {
          identityValid = identityValid && !!formData.ssn;
        } else if (formData.countryCode === 'GB') {
          identityValid = identityValid && !!formData.nationalInsuranceNumber;
        } else {
          // Other countries require passport
          identityValid = identityValid && !!formData.passport;
        }

        // Bank details validation (common for all countries)
        identityValid = identityValid && !!(formData.bankAccountHolderName && formData.bankName && formData.accountNumber && formData.accountType && formData.currency);

        // Country-specific bank validation
        if (formData.countryCode === 'IN') {
          identityValid = identityValid && !!formData.ifscCode;
        } else if (['GB', 'DE', 'FR'].includes(formData.countryCode)) {
          identityValid = identityValid && !!(formData.iban && formData.swiftBic);
        } else {
          // International
          // identityValid = identityValid && !!(formData.swiftCode && formData.bankCountry);
        }

        if (!identityValid) {
          console.log('Identity validation failed:', {
            countryCode: !!formData.countryCode,
            // Identity fields
            aadhaar: formData.countryCode === 'IN' ? !!formData.aadhaar : 'N/A',
            pan: formData.countryCode === 'IN' ? !!formData.pan : 'N/A',
            ssn: formData.countryCode === 'US' ? !!formData.ssn : 'N/A',
            nationalInsuranceNumber: formData.countryCode === 'GB' ? !!formData.nationalInsuranceNumber : 'N/A',
            passport: !['IN', 'US', 'GB'].includes(formData.countryCode) ? !!formData.passport : 'N/A',
            // Bank fields
            bankAccountHolderName: !!formData.bankAccountHolderName,
            bankName: !!formData.bankName,
            accountNumber: !!formData.accountNumber,
            // Country-specific bank fields
            ifscCode: formData.countryCode === 'IN' ? !!formData.ifscCode : 'N/A',
            routingNumber: formData.countryCode === 'US' ? !!formData.routingNumber : 'N/A',
            iban: ['GB', 'DE', 'FR'].includes(formData.countryCode) ? !!formData.iban : 'N/A',
            swiftBic: ['GB', 'DE', 'FR'].includes(formData.countryCode) ? !!formData.swiftBic : 'N/A',
            swiftCode: !['IN', 'US', 'GB', 'DE', 'FR'].includes(formData.countryCode) ? !!formData.swiftCode : 'N/A'
          });
        }
        return identityValid;
      case 'address': 
        const addressValid = !!(formData.currentAddress && formData.currentCity && formData.currentState && formData.currentPinCode);
        if (!addressValid) console.log('Address validation failed:', { currentAddress: !!formData.currentAddress, currentCity: !!formData.currentCity, currentState: !!formData.currentState, currentPinCode: !!formData.currentPinCode });
        return addressValid;
      case 'professional':
        const professionalValid = !!(formData.department && formData.designation && formData.joinDate && formData.employmentType);
        if (!professionalValid) console.log('Professional validation failed:', { department: !!formData.department, designation: !!formData.designation, joinDate: !!formData.joinDate, employmentType: !!formData.employmentType });
        return professionalValid;
      case 'documents':
        // Check if all document entries have both name and file
        const validEntries = documentEntries.filter(entry => entry.name.trim() && entry.file);
        return validEntries.length === documentEntries.length && documentEntries.length > 0;
      default:
        return true;
    }
  };

  const handleSaveAndNext = () => {
    if (!validateSection(activeSection)) {
      alert('Please fill all required fields before proceeding.');
      return;
    }
    
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };
  
  const handleBack = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };
  
  const generateEmployeeId = () => {
    const timestamp = Date.now().toString().slice(-4);
    return `EMP${timestamp}`;
  };

  const addDocumentEntry = () => {
    const newId = Date.now().toString();
    setDocumentEntries(prev => [...prev, { id: newId, name: '', file: null }]);
  };

  const removeDocumentEntry = (id: string) => {
    setDocumentEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const updateDocumentEntry = (id: string, field: 'name' | 'file', value: string | File | null) => {
    setDocumentEntries(prev => prev.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!validateSection('professional') || !validateSection('documents')) {
      alert('Please fill all required fields before submitting.');
      return;
    }

    try {
      const finalEmployeeId = formData.employeeId || generateEmployeeId();
      const employeeData = {
        tenantId: user?._id || 'default', // Use user ID as tenant ID for now
        employeeId: finalEmployeeId,
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
          gender: formData.gender || undefined,
          maritalStatus: formData.maritalStatus,
          bloodGroup: formData.bloodGroup,
          currentAddress: formData.currentAddress,
          currentCity: formData.currentCity,
          currentState: formData.currentState,
          currentPinCode: formData.currentPinCode,
          currentCountry: formData.currentCountry,
          permanentAddress: formData.sameAsCurrentAddress ? formData.currentAddress : formData.permanentAddress,
          permanentCity: formData.sameAsCurrentAddress ? formData.currentCity : formData.permanentCity,
          permanentState: formData.sameAsCurrentAddress ? formData.currentState : formData.permanentState,
          permanentPinCode: formData.sameAsCurrentAddress ? formData.currentPinCode : formData.permanentPinCode,
          permanentCountry: formData.sameAsCurrentAddress ? formData.currentCountry : formData.permanentCountry,
          sameAsCurrentAddress: formData.sameAsCurrentAddress
        },
        identityInfo: {
          countryCode: formData.countryCode,
          // India specific
          aadhaar: formData.aadhaar,
          pan: formData.pan,
          uan: formData.uan,
          esicNumber: formData.esicNumber,
          pfAccountNumber: formData.pfAccountNumber,
          // US specific
          ssn: formData.ssn,
          visaExpiryDate: formData.visaExpiryDate ? new Date(formData.visaExpiryDate) : undefined,
          // UK specific
          nationalInsuranceNumber: formData.nationalInsuranceNumber,
          // Generic international
          nationalIdNumber: formData.nationalIdNumber,
          workPermitNumber: formData.workPermitNumber,
          visaType: formData.visaType,
          // Common
          passport: formData.passport,
          drivingLicense: formData.drivingLicense,
          voterId: formData.voterId,
          // Bank details
          bankAccountHolderName: formData.bankAccountHolderName,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountType: formData.accountType,
          currency: formData.currency,
          payrollEnabled: formData.payrollEnabled,
          // India bank
          ifscCode: formData.ifscCode,
          upiId: formData.upiId,
          // US bank
          routingNumber: formData.routingNumber,
          bankAddress: formData.bankAddress,
          achEnabled: formData.achEnabled,
          // Europe bank
          iban: formData.iban,
          swiftBic: formData.swiftBic,
          // International bank
          swiftCode: formData.swiftCode,
          bankCountry: formData.bankCountry
        },
        workInfo: {
          department: formData.department,
          designation: formData.designation,
          reportingManager: formData.reportingManager,
          joinDate: new Date(formData.joinDate),
          employmentType: formData.employmentType as 'full-time' | 'part-time' | 'contract' | 'intern',
          workLocation: formData.workLocation as 'office' | 'remote' | 'hybrid',
          probationPeriod: parseInt(formData.probationPeriod) || 6,
          experience: formData.experience,
          highestQualification: formData.highestQualification,
          skillSet: formData.skillSet,
          highestSalary: formData.highestSalary ? parseFloat(formData.highestSalary) : undefined
        },
        status: (isFromOnboarding ? 'onboarding' : 'active') as 'active' | 'inactive' | 'onboarding' | 'terminated',
        source: (isFromOnboarding ? 'onboarding' : 'direct') as 'direct' | 'onboarding'
      };

      // Make API call to create employee
      const response = await employeeService.create(employeeData);

      if (response.data.success) {
        const createdEmployee = response.data.data;

        // Upload documents for the created employee
        try {
          for (const docEntry of documentEntries) {
            if (docEntry.name.trim() && docEntry.file) {
              // Convert file to base64 for now (temporary solution)
              const base64 = await fileToBase64(docEntry.file);

              const documentData = {
                employeeId: createdEmployee._id,
                documentType: 'other', // You can map document names to types
                title: docEntry.name,
                fileName: docEntry.file.name,
                fileUrl: base64, // Store base64 data temporarily
                fileSize: docEntry.file.size,
                mimeType: docEntry.file.type,
                status: 'active' as const,
                accessLevel: 'employee' as const
              };

              await documentService.create(documentData);
            }
          }
        } catch (docError) {
          console.error('Error uploading documents:', docError);
          alert('Employee created but some documents failed to upload. Please check the console for details.');
        }

        alert('Employee created successfully!');
        // Navigate back to appropriate page
        if (isFromOnboarding) {
          navigate('/core-hr/onboarding/new-employees');
        } else {
          navigate('/core-hr/employees/directory');
        }
      } else {
        alert('Failed to create employee. Please try again.');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee. Please check the console for details.');
    }
  };

  const sections: FormSection[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      icon: User,
      fields: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select 
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marital Status
            </label>
            <select 
              value={formData.maritalStatus}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <select 
              value={formData.bloodGroup}
              onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
      )
    },
    {
      id: 'identity',
      title: 'Identity and Bank Details',
      icon: CreditCard,
      fields: (
        <div className="space-y-6">
          {/* Country Selection - First and Mandatory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country of Employment <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.countryCode}
              onChange={(e) => handleInputChange('countryCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select country</option>
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="AE">UAE</option>
              <option value="SG">Singapore</option>
              <option value="AU">Australia</option>
              <option value="CA">Canada</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </select>
          </div>

          {/* Identity Details - Dynamic by Country */}
          {formData.countryCode && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Identity Details</h3>

              {formData.countryCode === 'IN' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3">Government Identity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aadhaar Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.aadhaar}
                          onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="XXXX-XXXX-XXXX"
                          maxLength={12}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PAN Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.pan}
                          onChange={(e) => handleInputChange('pan', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="ABCDE1234F"
                          maxLength={10}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Passport Number
                        </label>
                        <input
                          type="text"
                          value={formData.passport}
                          onChange={(e) => handleInputChange('passport', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter passport number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Driving License Number
                        </label>
                        <input
                          type="text"
                          value={formData.drivingLicense}
                          onChange={(e) => handleInputChange('drivingLicense', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter driving license"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Voter ID
                        </label>
                        <input
                          type="text"
                          value={formData.voterId}
                          onChange={(e) => handleInputChange('voterId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter voter ID"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3">Employment Statutory IDs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          UAN Number
                        </label>
                        <input
                          type="text"
                          value={formData.uan}
                          onChange={(e) => handleInputChange('uan', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter UAN number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ESIC Number
                        </label>
                        <input
                          type="text"
                          value={formData.esicNumber}
                          onChange={(e) => handleInputChange('esicNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter ESIC number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PF Account Number
                        </label>
                        <input
                          type="text"
                          value={formData.pfAccountNumber}
                          onChange={(e) => handleInputChange('pfAccountNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter PF account number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {formData.countryCode === 'US' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Social Security Number (SSN) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.ssn}
                        onChange={(e) => handleInputChange('ssn', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="XXX-XX-XXXX"
                        maxLength={11}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passport Number
                      </label>
                      <input
                        type="text"
                        value={formData.passport}
                        onChange={(e) => handleInputChange('passport', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter passport number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Driving License Number
                      </label>
                      <input
                        type="text"
                        value={formData.drivingLicense}
                        onChange={(e) => handleInputChange('drivingLicense', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter driving license"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Authorization Type
                      </label>
                      <select
                        value={formData.workAuthorizationType}
                        onChange={(e) => handleInputChange('workAuthorizationType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select type</option>
                        <option value="citizen">Citizen</option>
                        <option value="green_card">Green Card</option>
                        <option value="h1b">H1B</option>
                        <option value="l1">L1</option>
                        <option value="opt">OPT</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visa Expiry Date
                      </label>
                      <input
                        type="date"
                        value={formData.visaExpiryDate}
                        onChange={(e) => handleInputChange('visaExpiryDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.countryCode === 'GB' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        National Insurance Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.nationalInsuranceNumber}
                        onChange={(e) => handleInputChange('nationalInsuranceNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="AB 12 34 56 C"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passport Number
                      </label>
                      <input
                        type="text"
                        value={formData.passport}
                        onChange={(e) => handleInputChange('passport', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter passport number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Right to Work Status
                      </label>
                      <select
                        value={formData.rightToWorkStatus}
                        onChange={(e) => handleInputChange('rightToWorkStatus', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select status</option>
                        <option value="settled">Settled</option>
                        <option value="pre-settled">Pre-settled</option>
                        <option value="no-right">No Right to Work</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {(formData.countryCode !== 'IN' && formData.countryCode !== 'US' && formData.countryCode !== 'GB') && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        National ID Number
                      </label>
                      <input
                        type="text"
                        value={formData.nationalIdNumber}
                        onChange={(e) => handleInputChange('nationalIdNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter national ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passport Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.passport}
                        onChange={(e) => handleInputChange('passport', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter passport number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Permit Number
                      </label>
                      <input
                        type="text"
                        value={formData.workPermitNumber}
                        onChange={(e) => handleInputChange('workPermitNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter work permit number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visa Type
                      </label>
                      <input
                        type="text"
                        value={formData.visaType}
                        onChange={(e) => handleInputChange('visaType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter visa type"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bank Details - Country-Based & Mandatory for Payroll */}
          {formData.countryCode && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>

              {/* Common Bank Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bankAccountHolderName}
                    onChange={(e) => handleInputChange('bankAccountHolderName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account holder name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter bank name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => handleInputChange('accountType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="salary">Salary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency 
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                    <option value="AED">AED</option>
                    <option value="SGD">SGD</option>
                    <option value="AUD">AUD</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>

               <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter IFSC code"
                    />
                  </div>
              </div>

              {formData.countryCode === 'US' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Routing Number 
                    </label>
                    <input
                      type="text"
                      value={formData.routingNumber}
                      onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter routing number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Address
                    </label>
                    <input
                      type="text"
                      value={formData.bankAddress}
                      onChange={(e) => handleInputChange('bankAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter bank address"
                    />
                  </div>
                </div>
              )}

              {(formData.countryCode === 'GB' || formData.countryCode === 'DE' || formData.countryCode === 'FR') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IBAN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.iban}
                      onChange={(e) => handleInputChange('iban', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter IBAN"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SWIFT / BIC <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.swiftBic}
                      onChange={(e) => handleInputChange('swiftBic', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter SWIFT/BIC"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Address
                    </label>
                    <input
                      type="text"
                      value={formData.bankAddress}
                      onChange={(e) => handleInputChange('bankAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter bank address"
                    />
                  </div>
                </div>
              )}

              {(!['IN', 'US', 'GB', 'DE', 'FR'].includes(formData.countryCode)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SWIFT Code 
                    </label>
                    <input
                      type="text"
                      value={formData.swiftCode}
                      onChange={(e) => handleInputChange('swiftCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter SWIFT code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IBAN
                    </label>
                    <input
                      type="text"
                      value={formData.iban}
                      onChange={(e) => handleInputChange('iban', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter IBAN (if applicable)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Country 
                    </label>
                    <input
                      type="text"
                      value={formData.bankCountry}
                      onChange={(e) => handleInputChange('bankCountry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter bank country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Address
                    </label>
                    <input
                      type="text"
                      value={formData.bankAddress}
                      onChange={(e) => handleInputChange('bankAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter bank address"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'address',
      title: 'Address Details',
      icon: MapPin,
      fields: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.currentAddress}
                onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.currentCity}
                onChange={(e) => handleInputChange('currentCity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.currentState}
                onChange={(e) => handleInputChange('currentState', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.currentPinCode}
                onChange={(e) => handleInputChange('currentPinCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter PIN code"
                maxLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select 
                value={formData.currentCountry}
                onChange={(e) => handleInputChange('currentCountry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="india">India</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Permanent Address</h4>
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                id="sameAddress" 
                className="mr-2" 
                checked={formData.sameAsCurrentAddress}
                onChange={(e) => handleInputChange('sameAsCurrentAddress', e.target.checked)}
              />
              <label htmlFor="sameAddress" className="text-sm text-gray-600">
                Same as current address
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permanent Address
                </label>
                <textarea
                  rows={3}
                  value={formData.sameAsCurrentAddress ? formData.currentAddress : formData.permanentAddress}
                  onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter permanent address"
                  disabled={formData.sameAsCurrentAddress}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.sameAsCurrentAddress ? formData.currentCity : formData.permanentCity}
                  onChange={(e) => handleInputChange('permanentCity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                  disabled={formData.sameAsCurrentAddress}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.sameAsCurrentAddress ? formData.currentState : formData.permanentState}
                  onChange={(e) => handleInputChange('permanentState', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter state"
                  disabled={formData.sameAsCurrentAddress}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={formData.sameAsCurrentAddress ? formData.currentPinCode : formData.permanentPinCode}
                  onChange={(e) => handleInputChange('permanentPinCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter PIN code"
                  maxLength={6}
                  disabled={formData.sameAsCurrentAddress}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select 
                  value={formData.sameAsCurrentAddress ? formData.currentCountry : formData.permanentCountry}
                  onChange={(e) => handleInputChange('permanentCountry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={formData.sameAsCurrentAddress}
                >
                  <option value="india">India</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )
          },
    {
      id: 'documents',
      title: 'Documents',
      icon: Upload,
      fields: (
        <div className="space-y-6">
          <div className="text-sm text-gray-600 mb-4">
            Add employee documents. Each document needs a name and file.
          </div>

          {documentEntries.map((entry, index) => (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium text-gray-900">Document {index + 1}</h4>
                {documentEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDocumentEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.name}
                    onChange={(e) => updateDocumentEntry(entry.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter document name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Upload <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        updateDocumentEntry(entry.id, 'file', file);
                      }}
                      className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {entry.file && (
                      <span className="text-xs text-green-600 font-medium">
                        {(entry.file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={addDocumentEntry}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Upload className="w-4 h-4" />
              <span>Add Another Document</span>
            </button>

            <div className="text-sm text-gray-500">
              {documentEntries.filter(e => e.name.trim() && e.file).length} of {documentEntries.length} documents ready
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'professional',
      title: 'Professional Details',
      icon: Briefcase,
      fields: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select 
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select department</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter designation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reporting Manager
            </label>
            <select 
              value={formData.reportingManager}
              onChange={(e) => handleInputChange('reportingManager', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select manager</option>
              <option value="1">John Smith</option>
              <option value="2">Jane Doe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Join Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.joinDate}
              onChange={(e) => handleInputChange('joinDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select 
              value={formData.employmentType}
              onChange={(e) => handleInputChange('employmentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Location
            </label>
            <select 
              value={formData.workLocation}
              onChange={(e) => handleInputChange('workLocation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="office">Office</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Probation Period (Months)
            </label>
            <input
              type="number"
              value={formData.probationPeriod}
              onChange={(e) => handleInputChange('probationPeriod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter probation period"
              min="0"
              max="12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience (Total years)
            </label>
            <input
              type="text"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Highest Qualification
            </label>
            <input
              type="text"
              value={formData.highestQualification}
              onChange={(e) => handleInputChange('highestQualification', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter qualification"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Salary
            </label>
            <input
              type="text"
              value={formData.highestSalary}
              onChange={(e) => handleInputChange('highestSalary', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill Set
            </label>
            <textarea
              rows={3}
              value={formData.skillSet}
              onChange={(e) => handleInputChange('skillSet', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List relevant skills..."
            />
          </div>
        </div>
      )
    }
  ];

  const currentSection = sections.find(s => s.id === activeSection);
  const CurrentIcon = currentSection?.icon || User;

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <Card className="bg-white shadow-sm border-0 rounded-xl">
        <CardContent className="p-4">
          <div className="flex gap-16 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                    activeSection === section.id
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium text-center">{section.title}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="bg-white shadow-sm border-0 rounded-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CurrentIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {currentSection?.title}
                {isFromOnboarding && (
                  <Badge className="ml-2 bg-purple-100 text-purple-800 border-0 text-xs">
                    Onboarding
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {isNewEmployee ? 'Create new employee profile' : 'Update employee information'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentSection?.fields}

          {/* Form Actions */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {activeSection !== 'basic' ? (
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            <div className="flex space-x-4">
              {activeSection !== 'professional' ? (
                <Button onClick={handleSaveAndNext} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save & Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Details
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeProfile;