import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Search, FileText, BarChart3, Users, Building2, Briefcase,
  ArrowRight, ChevronDown, Sparkles, Target, TrendingUp,
  MessageSquare, Layers, CircleDot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';

// Lazy load Three.js component
const CurrencyCanvas = lazy(() => import('@/components/CurrencyCanvas'));

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

// Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'navbar-glass py-4' : 'py-6 bg-transparent'
    }`}>
      <div className="container-custom flex items-center justify-between">
        <a href="#" className="flex items-center gap-2" data-testid="logo-link">
          <span className="text-gold font-display text-2xl font-semibold tracking-tight">
            FounderFund
          </span>
        </a>
        <Button
          onClick={() => document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })}
          className="btn-primary hidden md:flex items-center gap-2"
          data-testid="nav-cta-btn"
        >
          Join Waitlist
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden" data-testid="hero-section">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <CurrencyCanvas />
        </Suspense>
      </div>
      
      {/* Texture overlay */}
      <div className="absolute inset-0 hero-bg-overlay z-[1]" />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-obsidian to-transparent z-[2]" />
      
      <motion.div 
        style={{ opacity, y }}
        className="container-custom relative z-10"
      >
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gold/60 text-sm tracking-[0.3em] uppercase mb-6 font-body"
            data-testid="hero-tagline"
          >
            The Missing Layer Between Founders & Capital
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] text-white mb-8"
            data-testid="hero-headline"
          >
            Find funding opportunities.{' '}
            <span className="text-gradient-gold">Apply once.</span>{' '}
            Track everything.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-white/70 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl font-body"
            data-testid="hero-subtext"
          >
            FounderFund helps founders discover relevant investors, apply faster, and track responses. 
            Investors discover aligned startups and manage inbound interest. 
            Funds reduce noise, duplication, and missed opportunities across deal flow.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={() => document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary flex items-center justify-center gap-2"
              data-testid="hero-primary-cta"
            >
              Join the early access waitlist
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary flex items-center justify-center gap-2"
              data-testid="hero-secondary-cta"
            >
              Tell us your fundraising pain
              <ChevronDown className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2 text-white/30">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};

// Problem Section
const ProblemSection = () => {
  const problems = [
    {
      icon: <Layers className="w-5 h-5" />,
      text: "Funding information is scattered across Twitter, LinkedIn, emails, Notion, and warm intros"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      text: "Founders send the same deck dozens of times with no visibility after applying"
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      text: "Investors receive unstructured inbound pitches and lose track of conversations"
    },
    {
      icon: <Target className="w-5 h-5" />,
      text: "Follow-ups, feedback, and status updates are inconsistent or missing"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      text: "Everyone ends up tracking critical funding activity in fragile spreadsheets"
    }
  ];

  return (
    <section id="problem" className="py-24 md:py-32 bg-obsidian relative" data-testid="problem-section">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p 
            variants={fadeInUp}
            className="text-gold/60 text-sm tracking-[0.3em] uppercase mb-4 font-body"
          >
            The Problem
          </motion.p>
          <motion.h2 
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl font-normal tracking-tight text-white mb-16"
            data-testid="problem-headline"
          >
            Fundraising is broken
          </motion.h2>
          
          <div className="grid gap-4 md:gap-6">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="pain-card flex items-start gap-4 group"
                data-testid={`problem-card-${index}`}
              >
                <div className="text-gold/60 group-hover:text-gold mt-1 transition-colors duration-300">
                  {problem.icon}
                </div>
                <p className="text-white/80 text-base md:text-lg leading-relaxed font-body">
                  {problem.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Solution Section
const SolutionSection = () => {
  const steps = [
    {
      number: "01",
      title: "Discover",
      description: "Find relevant funding opportunities or startups in one place",
      icon: <Search className="w-6 h-6" />
    },
    {
      number: "02",
      title: "Apply",
      description: "Engage using a single profile instead of repeating information",
      icon: <FileText className="w-6 h-6" />
    },
    {
      number: "03",
      title: "Track",
      description: "Monitor conversations, interest, and outcomes in one clear dashboard",
      icon: <BarChart3 className="w-6 h-6" />
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-charcoal relative" data-testid="solution-section">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p 
            variants={fadeInUp}
            className="text-gold/60 text-sm tracking-[0.3em] uppercase mb-4 font-body"
          >
            The Solution
          </motion.p>
          <motion.h2 
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl font-normal tracking-tight text-white mb-16"
            data-testid="solution-headline"
          >
            Three steps to clarity
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative group"
                data-testid={`solution-step-${index}`}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-gold/40 to-gold/10" />
                )}
                
                <div className="glass-card p-8 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-gold/30 font-display text-4xl font-semibold">
                      {step.number}
                    </span>
                    <div className="text-gold group-hover:text-gold-glow transition-colors duration-300">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="font-display text-2xl text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/60 font-body leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Audience Section
const AudienceSection = () => {
  const audiences = {
    founders: {
      title: "For Founders",
      icon: <Sparkles className="w-6 h-6" />,
      segments: [
        "First-time founders",
        "Indie hackers and solo builders",
        "Early-stage startups",
        "Growth-stage startups"
      ]
    },
    investors: {
      title: "For Investors",
      icon: <TrendingUp className="w-6 h-6" />,
      segments: [
        "Angel investors",
        "Micro-VCs and syndicates",
        "Institutional funds",
        "Family offices"
      ]
    }
  };

  return (
    <section className="py-24 md:py-32 bg-obsidian relative" data-testid="audience-section">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p 
            variants={fadeInUp}
            className="text-gold/60 text-sm tracking-[0.3em] uppercase mb-4 font-body"
          >
            Who It's For
          </motion.p>
          <motion.h2 
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl font-normal tracking-tight text-white mb-16"
            data-testid="audience-headline"
          >
            Built for both sides of the table
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {Object.entries(audiences).map(([key, audience], index) => (
              <motion.div
                key={key}
                variants={fadeInUp}
                className="audience-card p-8 md:p-10 group"
                data-testid={`audience-card-${key}`}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-gold group-hover:scale-110 transition-transform duration-300">
                    {audience.icon}
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl text-white">
                    {audience.title}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {audience.segments.map((segment, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-white/70 font-body">
                      <CircleDot className="w-3 h-3 text-gold/60" />
                      {segment}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Early Access Form Section
const EarlyAccessSection = () => {
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    founderStage: '',
    fundingStage: '',
    biggestPain: '',
    detailedPain: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const painOptions = [
    "Finding relevant investors or startups",
    "Sending the same information repeatedly",
    "Tracking applications and conversations",
    "Getting feedback or status updates",
    "Managing deal flow efficiently",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.role || !formData.biggestPain) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        email: formData.email,
        role: formData.role,
        founder_stage: formData.founderStage || null,
        funding_stage: formData.fundingStage || null,
        biggest_pain: formData.biggestPain,
        detailed_pain: formData.detailedPain || null
      };
      
      await axios.post(`${API}/waitlist`, payload);
      
      setIsSubmitted(true);
      toast.success('Welcome to the waitlist! We\'ll be in touch soon.');
      
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('This email is already on our waitlist');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="early-access" className="py-24 md:py-32 bg-charcoal relative" data-testid="early-access-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="glass-active p-12 md:p-16">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-white mb-4">
                You're on the list
              </h3>
              <p className="text-white/60 font-body text-lg">
                Thank you for your interest in FounderFund. We'll reach out soon with early access details.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="early-access" className="py-24 md:py-32 bg-charcoal relative" data-testid="early-access-section">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,transparent_60%)]" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="max-w-2xl mx-auto">
            <motion.p 
              variants={fadeInUp}
              className="text-gold/60 text-sm tracking-[0.3em] uppercase mb-4 font-body text-center"
            >
              Early Access
            </motion.p>
            <motion.h2 
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-normal tracking-tight text-white mb-6 text-center"
              data-testid="early-access-headline"
            >
              Shape the future of funding
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-white/60 font-body text-lg text-center mb-12"
            >
              Your input helps us build the product that actually solves your problems.
            </motion.p>
            
            <motion.form
              variants={fadeInUp}
              onSubmit={handleSubmit}
              className="glass-active p-8 md:p-12 space-y-8"
              data-testid="waitlist-form"
            >
              {/* Email */}
              <div>
                <label className="form-label block">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@company.com"
                  className="form-input bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:border-gold focus-visible:ring-0 focus-visible:ring-offset-0"
                  required
                  data-testid="email-input"
                />
              </div>
              
              {/* Role */}
              <div>
                <label className="form-label block">I am a *</label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value, founderStage: '', fundingStage: '' })}
                  data-testid="role-select"
                >
                  <SelectTrigger className="form-input bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:ring-0 focus:ring-offset-0 [&>span]:text-white/80">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-white/10">
                    <SelectItem value="Founder" className="text-white hover:bg-white/10 focus:bg-white/10">Founder</SelectItem>
                    <SelectItem value="Investor" className="text-white hover:bg-white/10 focus:bg-white/10">Investor</SelectItem>
                    <SelectItem value="Fund" className="text-white hover:bg-white/10 focus:bg-white/10">Investment Firm / Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Conditional: Founder Stage */}
              {formData.role === 'Founder' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="form-label block">Startup Stage</label>
                  <Select
                    value={formData.founderStage}
                    onValueChange={(value) => setFormData({ ...formData, founderStage: value })}
                    data-testid="founder-stage-select"
                  >
                    <SelectTrigger className="form-input bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:ring-0 focus:ring-offset-0 [&>span]:text-white/80">
                      <SelectValue placeholder="Select your stage" />
                    </SelectTrigger>
                    <SelectContent className="bg-charcoal border-white/10">
                      <SelectItem value="Idea" className="text-white hover:bg-white/10 focus:bg-white/10">Idea Stage</SelectItem>
                      <SelectItem value="MVP" className="text-white hover:bg-white/10 focus:bg-white/10">MVP / Pre-revenue</SelectItem>
                      <SelectItem value="Revenue" className="text-white hover:bg-white/10 focus:bg-white/10">Revenue Generating</SelectItem>
                      <SelectItem value="Growth" className="text-white hover:bg-white/10 focus:bg-white/10">Growth Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
              
              {/* Conditional: Investment Focus */}
              {(formData.role === 'Investor' || formData.role === 'Fund') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="form-label block">Investment Focus</label>
                  <Select
                    value={formData.fundingStage}
                    onValueChange={(value) => setFormData({ ...formData, fundingStage: value })}
                    data-testid="funding-stage-select"
                  >
                    <SelectTrigger className="form-input bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:ring-0 focus:ring-offset-0 [&>span]:text-white/80">
                      <SelectValue placeholder="Select your focus" />
                    </SelectTrigger>
                    <SelectContent className="bg-charcoal border-white/10">
                      <SelectItem value="Pre-seed" className="text-white hover:bg-white/10 focus:bg-white/10">Pre-seed</SelectItem>
                      <SelectItem value="Seed" className="text-white hover:bg-white/10 focus:bg-white/10">Seed</SelectItem>
                      <SelectItem value="Series A" className="text-white hover:bg-white/10 focus:bg-white/10">Series A</SelectItem>
                      <SelectItem value="Later" className="text-white hover:bg-white/10 focus:bg-white/10">Series B+</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
              
              {/* Biggest Pain */}
              <div>
                <label className="form-label block">Biggest pain in fundraising/deal flow *</label>
                <Select
                  value={formData.biggestPain}
                  onValueChange={(value) => setFormData({ ...formData, biggestPain: value })}
                  data-testid="pain-select"
                >
                  <SelectTrigger className="form-input bg-transparent border-0 border-b border-white/20 rounded-none px-0 focus:ring-0 focus:ring-offset-0 [&>span]:text-white/80">
                    <SelectValue placeholder="Select your biggest challenge" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-white/10">
                    {painOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-white hover:bg-white/10 focus:bg-white/10">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Detailed Pain (Optional) */}
              <div>
                <label className="form-label block">Tell us more (optional)</label>
                <Textarea
                  value={formData.detailedPain}
                  onChange={(e) => setFormData({ ...formData, detailedPain: e.target.value })}
                  placeholder="Describe your specific challenges with fundraising or deal flow..."
                  className="form-input bg-transparent border border-white/10 rounded-none min-h-[120px] focus:border-gold focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                  data-testid="detailed-pain-textarea"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2"
                data-testid="submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Join the early access waitlist
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Credibility Section
const CredibilitySection = () => {
  return (
    <section className="py-24 md:py-32 bg-obsidian relative" data-testid="credibility-section">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="gold-accent-line mb-12" />
          
          <motion.p 
            variants={fadeInUp}
            className="text-white/80 font-body text-lg md:text-xl leading-relaxed mb-6"
            data-testid="credibility-text-1"
          >
            "Built by engineers who've experienced fundraising and deal-flow chaos firsthand."
          </motion.p>
          
          <motion.p 
            variants={fadeInUp}
            className="text-white/50 font-body text-base"
            data-testid="credibility-text-2"
          >
            Currently validating with founders and investors across stages.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="gold-accent-line mt-12" />
          
          <motion.div variants={fadeInUp} className="mt-16">
            <Button
              onClick={() => document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary flex items-center gap-2 mx-auto"
              data-testid="credibility-cta"
            >
              Join the early access waitlist
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-12 bg-charcoal border-t border-white/5" data-testid="footer">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gold font-display text-xl font-semibold">
              FounderFund
            </span>
          </div>
          
          <p className="text-white/40 text-sm font-body">
            © {new Date().getFullYear()} FounderFund. The missing layer between founders & capital.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  return (
    <main className="bg-obsidian min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <AudienceSection />
      <EarlyAccessSection />
      <CredibilitySection />
      <Footer />
    </main>
  );
}
