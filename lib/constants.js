import { parse, format } from 'date-fns';

export const INSTRUCTOR_INFO = {
  name: "Alex Thompson",
  title: "Professional Driving Instructor",
  phone: "0412 345 678",
  email: "lessons@drivinginstructor.sydney",
  experience: "15+ years",
  license: "Fully licensed and insured",
  areas: [
    "Sydney CBD",
    "Inner West (Newtown, Marrickville, Summer Hill)",
    "Eastern Suburbs (Bondi, Coogee, Randwick)",
    "North Shore (Chatswood, North Sydney, Mosman)"
  ]
};

export const PRICING = {
  single: { price: 45, duration: 60, label: "Single Lesson" },
  package5: { price: 220, duration: 60, label: "5-Lesson Package", savings: 5 },
  package10: { price: 430, duration: 60, label: "10-Lesson Package", savings: 20 },
  testPrep: { price: 50, duration: 90, label: "Test Preparation" }
};

export const AVAILABILITY = {
  weekdays: {
    Monday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    Tuesday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    Wednesday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    Thursday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    Friday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
  },
  weekends: {
    Saturday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
    Sunday: []
  }
};

export const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    text: "Alex is an amazing instructor! Patient, knowledgeable, and really helped me build confidence on the road. Passed my test on first attempt!",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b79c?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "James Mitchell",
    text: "Best decision choosing Alex for my driving lessons. The structured approach and detailed feedback made all the difference. Highly recommended!",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Emily Rodriguez",
    text: "I was nervous about driving but Alex made me feel comfortable from day one. Great patience and excellent teaching methods.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
  }
];

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
};

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};