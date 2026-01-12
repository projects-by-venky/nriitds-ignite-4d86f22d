import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { useState } from "react";

// Department configuration
const departments: Record<string, { name: string; code: string }> = {
  cse: { name: "Computer Science & Engineering", code: "CSE" },
  ece: { name: "Electronics & Communication", code: "ECE" },
  eee: { name: "Electrical & Electronics", code: "EEE" },
  mech: { name: "Mechanical Engineering", code: "MECH" },
  civil: { name: "Civil Engineering", code: "CIVIL" },
  aids: { name: "AI & Data Science", code: "DS" },
  mba: { name: "Business Administration", code: "MBA" },
  mca: { name: "Computer Applications", code: "MCA" }
};

// Syllabus Review Form URLs - centralized configuration
// Replace these placeholder URLs with actual Google Form URLs
const syllabusReviewForms: Record<string, Record<string, Record<string, string>>> = {
  cse: {
    "1-1": {
      "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExample1-1-CSE-A/viewform?embedded=true",
      "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExample1-1-CSE-B/viewform?embedded=true",
      "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExample1-1-CSE-C/viewform?embedded=true",
    },
    "1-2": {
      "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExample1-2-CSE-A/viewform?embedded=true",
      "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExample1-2-CSE-B/viewform?embedded=true",
      "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExample1-2-CSE-C/viewform?embedded=true",
    },
    "2-1": {
      "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExample2-1-CSE-A/viewform?embedded=true",
      "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExample2-1-CSE-B/viewform?embedded=true",
      "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExample2-1-CSE-C/viewform?embedded=true",
    },
    "2-2": {
      "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExample2-2-CSE-A/viewform?embedded=true",
      "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExample2-2-CSE-B/viewform?embedded=true",
      "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExample2-2-CSE-C/viewform?embedded=true",
    },
    "3-1": {
      "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExample3-1-CSE-A/viewform?embedded=true",
      "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExample3-1-CSE-B/viewform?embedded=true",
      "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExample3-1-CSE-C/viewform?embedded=true",
    },
    "3-2": {
      "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExample3-2-CSE-A/viewform?embedded=true",
      "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExample3-2-CSE-B/viewform?embedded=true",
      "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExample3-2-CSE-C/viewform?embedded=true",
    },
    "4-1": {
      "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExample4-1-CSE-A/viewform?embedded=true",
      "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExample4-1-CSE-B/viewform?embedded=true",
      "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExample4-1-CSE-C/viewform?embedded=true",
    },
    "4-2": {
      "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExample4-2-CSE-A/viewform?embedded=true",
      "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExample4-2-CSE-B/viewform?embedded=true",
      "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExample4-2-CSE-C/viewform?embedded=true",
    },
  },
  // Add more departments as needed - they follow the same structure
  ece: {
    "1-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true" },
    "1-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true" },
    "2-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true" },
    "2-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true" },
    "3-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true" },
    "3-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true" },
    "4-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true" },
    "4-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleECE/viewform?embedded=true" },
  },
  eee: {
    "1-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true" },
    "1-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true" },
    "2-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true" },
    "2-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true" },
    "3-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true" },
    "3-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true" },
    "4-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true" },
    "4-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleEEE/viewform?embedded=true" },
  },
  mech: {
    "1-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true" },
    "1-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true" },
    "2-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true" },
    "2-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true" },
    "3-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true" },
    "3-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true" },
    "4-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true" },
    "4-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMECH/viewform?embedded=true" },
  },
  civil: {
    "1-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true" },
    "1-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true" },
    "2-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true" },
    "2-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true" },
    "3-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true" },
    "3-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true" },
    "4-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true" },
    "4-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleCIVIL/viewform?embedded=true" },
  },
  aids: {
    "1-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true" },
    "1-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true" },
    "2-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true" },
    "2-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true" },
    "3-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true" },
    "3-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true" },
    "4-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true" },
    "4-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleDS/viewform?embedded=true" },
  },
  mba: {
    "1-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true" },
    "1-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true" },
    "2-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true" },
    "2-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true" },
    "3-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true" },
    "3-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true" },
    "4-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true" },
    "4-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMBA/viewform?embedded=true" },
  },
  mca: {
    "1-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true" },
    "1-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true" },
    "2-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true" },
    "2-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true" },
    "3-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true" },
    "3-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true" },
    "4-1": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true" },
    "4-2": { "A": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "B": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true", "C": "https://docs.google.com/forms/d/e/1FAIpQLSfExampleMCA/viewform?embedded=true" },
  },
};

// Helper to get form URL
const getFormUrl = (branch: string, semester: string, section: string): string | null => {
  return syllabusReviewForms[branch]?.[semester]?.[section.toUpperCase()] || null;
};

const SyllabusReviewForm = () => {
  const { branch, semester, section } = useParams<{ branch: string; semester: string; section: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const dept = branch ? departments[branch] : null;
  const formattedSection = section?.replace("section-", "").toUpperCase() || "";
  const formUrl = branch && semester && formattedSection 
    ? getFormUrl(branch, semester, formattedSection) 
    : null;

  if (!dept || !semester || !formattedSection) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">Form Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested syllabus review form could not be found.</p>
          <Link to="/faculty/syllabus-review" className="text-primary hover:underline">
            Return to Syllabus Review Forms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <Header />
      
      <main className="pt-16 md:pt-20 pb-24 md:pb-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
          {/* Back Navigation */}
          <Link to={`/faculty/syllabus-review/${branch}/${semester}`}>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 touch-target justify-start"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Sections</span>
            </motion.button>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#1E3A8A] flex items-center justify-center">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-black bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #0EA5E9, #1E3A8A)" }}>
                  {semester} {dept.code}-{formattedSection}
                </h1>
                <p className="text-sm text-muted-foreground">Syllabus Review Form</p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground mt-4">
              <Link to="/faculty/syllabus-review" className="hover:text-primary transition-colors">
                Syllabus Review
              </Link>
              <span>/</span>
              <Link to={`/faculty/syllabus-review/${branch}`} className="hover:text-primary transition-colors">
                {dept.code}
              </Link>
              <span>/</span>
              <Link to={`/faculty/syllabus-review/${branch}/${semester}`} className="hover:text-primary transition-colors">
                Semester {semester}
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Section {formattedSection}</span>
            </div>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/80 backdrop-blur-md border border-border rounded-2xl overflow-hidden"
          >
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading form...</span>
              </div>
            )}
            
            {/* Embedded Google Form */}
            {formUrl && (
              <iframe
                src={formUrl}
                width="100%"
                height="800"
                frameBorder="0"
                className={`bg-white ${isLoading ? 'hidden' : 'block'}`}
                onLoad={() => setIsLoading(false)}
                title={`${semester} ${dept.code}-${formattedSection} Syllabus Review Form`}
                style={{ minHeight: '600px' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              >
                Loading form...
              </iframe>
            )}
            
            {!formUrl && !isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Form URL not configured for this section.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default SyllabusReviewForm;
