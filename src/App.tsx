import React, { useState, useEffect, useRef } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  addDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwtIJsIZK0QyxqW4YRL3V7W0JhhhxGOqM",
  authDomain: "provas---escola.firebaseapp.com",
  projectId: "provas---escola",
  storageBucket: "provas---escola.firebasestorage.app",
  messagingSenderId: "45982708523",
  appId: "1:45982708523:web:b164710ebe058748dc8b6e",
  measurementId: "G-65X0YXQKKY",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const LEVELS = [
  { id: 1, title: "Aprendiz", minXp: 0, icon: "🌱" },
  { id: 2, title: "Explorador", minXp: 300, icon: "🧭" },
  { id: 3, title: "Aventureiro", minXp: 700, icon: "⚔️" },
  { id: 4, title: "Especialista", minXp: 1200, icon: "🏅" },
  { id: 5, title: "Mestre", minXp: 2000, icon: "🔮" },
  { id: 6, title: "Lenda", minXp: 3500, icon: "🐉" },
  { id: 7, title: "Guardião do Conhecimento", minXp: 6000, icon: "⚡" },
];

const STORE_ITEMS = [
  // Ícones Comuns e Raros
  {
    id: 101,
    category: "Ícones",
    slot: "icon",
    name: "Raposa",
    icon: "🦊",
    price: 100,
    rarity: "comum",
    color: "text-orange-400",
    minLevel: 1,
  },
  {
    id: 102,
    category: "Ícones",
    slot: "icon",
    name: "Coruja",
    icon: "🦉",
    price: 150,
    rarity: "comum",
    color: "text-amber-600",
    minLevel: 1,
  },
  {
    id: 116,
    category: "Ícones",
    slot: "icon",
    name: "Coração",
    icon: "💖",
    price: 150,
    rarity: "comum",
    color: "text-pink-500",
    minLevel: 1,
  },
  {
    id: 117,
    category: "Ícones",
    slot: "icon",
    name: "Estrela",
    icon: "⭐",
    price: 200,
    rarity: "comum",
    color: "text-yellow-400",
    minLevel: 1,
  },
  {
    id: 118,
    category: "Ícones",
    slot: "icon",
    name: "Lua",
    icon: "🌙",
    price: 250,
    rarity: "comum",
    color: "text-blue-300",
    minLevel: 1,
  },
  {
    id: 103,
    category: "Ícones",
    slot: "icon",
    name: "Cachorro",
    icon: "🐶",
    price: 200,
    rarity: "comum",
    color: "text-amber-300",
    minLevel: 1,
  },
  {
    id: 104,
    category: "Ícones",
    slot: "icon",
    name: "Gato",
    icon: "🐱",
    price: 200,
    rarity: "comum",
    color: "text-orange-300",
    minLevel: 1,
  },
  {
    id: 122,
    category: "Ícones",
    slot: "icon",
    name: "Fantasma",
    icon: "👻",
    price: 150,
    rarity: "comum",
    color: "text-gray-200",
    minLevel: 1,
  },
  {
    id: 123,
    category: "Ícones",
    slot: "icon",
    name: "Zumbi",
    icon: "🧟",
    price: 250,
    rarity: "comum",
    color: "text-green-600",
    minLevel: 1,
  },
  {
    id: 124,
    category: "Ícones",
    slot: "icon",
    name: "Sapo",
    icon: "🐸",
    price: 200,
    rarity: "comum",
    color: "text-green-400",
    minLevel: 1,
  },
  {
    id: 130,
    category: "Ícones",
    slot: "icon",
    name: "Pinguim",
    icon: "🐧",
    price: 200,
    rarity: "comum",
    color: "text-blue-200",
    minLevel: 1,
  },
  {
    id: 119,
    category: "Ícones",
    slot: "icon",
    name: "Árvore",
    icon: "🌳",
    price: 300,
    rarity: "raro",
    color: "text-green-500",
    minLevel: 2,
  },
  {
    id: 120,
    category: "Ícones",
    slot: "icon",
    name: "Flor",
    icon: "🌸",
    price: 350,
    rarity: "raro",
    color: "text-pink-300",
    minLevel: 2,
  },
  {
    id: 105,
    category: "Ícones",
    slot: "icon",
    name: "Ninja",
    icon: "🥷",
    price: 300,
    rarity: "raro",
    color: "text-slate-800",
    minLevel: 2,
  },
  {
    id: 106,
    category: "Ícones",
    slot: "icon",
    name: "Astronauta",
    icon: "👨‍🚀",
    price: 350,
    rarity: "raro",
    color: "text-blue-200",
    minLevel: 2,
  },
  {
    id: 107,
    category: "Ícones",
    slot: "icon",
    name: "Panda",
    icon: "🐼",
    price: 400,
    rarity: "raro",
    color: "text-slate-100",
    minLevel: 2,
  },
  {
    id: 125,
    category: "Ícones",
    slot: "icon",
    name: "Coruja Sábia",
    icon: "🦉",
    price: 350,
    rarity: "raro",
    color: "text-yellow-700",
    minLevel: 2,
  },
  {
    id: 126,
    category: "Ícones",
    slot: "icon",
    name: "Morcego",
    icon: "🦇",
    price: 400,
    rarity: "raro",
    color: "text-gray-800",
    minLevel: 2,
  },
  {
    id: 131,
    category: "Ícones",
    slot: "icon",
    name: "Urso Polar",
    icon: "🐻‍❄️",
    price: 300,
    rarity: "raro",
    color: "text-slate-100",
    minLevel: 2,
  },
  {
    id: 132,
    category: "Ícones",
    slot: "icon",
    name: "Rosa Mística",
    icon: "🌹",
    price: 400,
    rarity: "raro",
    color: "text-red-500",
    minLevel: 2,
  },

  // Ícones Épicos e Lendários
  {
    id: 108,
    category: "Ícones",
    slot: "icon",
    name: "Mago",
    icon: "🧙‍♂️",
    price: 500,
    rarity: "epico",
    color: "text-fuchsia-500",
    minLevel: 3,
  },
  {
    id: 109,
    category: "Ícones",
    slot: "icon",
    name: "Fada",
    icon: "🧚",
    price: 550,
    rarity: "epico",
    color: "text-pink-300",
    minLevel: 3,
  },
  {
    id: 110,
    category: "Ícones",
    slot: "icon",
    name: "Leão",
    icon: "🦁",
    price: 600,
    rarity: "epico",
    color: "text-yellow-600",
    minLevel: 3,
  },
  {
    id: 127,
    category: "Ícones",
    slot: "icon",
    name: "Polvo",
    icon: "🐙",
    price: 550,
    rarity: "epico",
    color: "text-red-400",
    minLevel: 3,
  },
  {
    id: 128,
    category: "Ícones",
    slot: "icon",
    name: "Robô",
    icon: "🤖",
    price: 600,
    rarity: "epico",
    color: "text-gray-400",
    minLevel: 3,
  },
  {
    id: 121,
    category: "Ícones",
    slot: "icon",
    name: "Brontossauro",
    icon: "🦕",
    price: 1500,
    rarity: "epico",
    color: "text-blue-400",
    minLevel: 4,
  },
  {
    id: 111,
    category: "Ícones",
    slot: "icon",
    name: "Dragão",
    icon: "🐉",
    price: 1000,
    rarity: "lendario",
    color: "text-green-500",
    minLevel: 4,
  },
  {
    id: 112,
    category: "Ícones",
    slot: "icon",
    name: "Alienígena",
    icon: "👽",
    price: 1200,
    rarity: "lendario",
    color: "text-lime-400",
    minLevel: 4,
  },
  {
    id: 129,
    category: "Ícones",
    slot: "icon",
    name: "Lobo Místico",
    icon: "🐺",
    price: 1000,
    rarity: "lendario",
    color: "text-indigo-400",
    minLevel: 4,
  },
  {
    id: 113,
    category: "Ícones",
    slot: "icon",
    name: "Unicórnio",
    icon: "🦄",
    price: 2000,
    rarity: "lendario",
    color: "text-pink-400",
    minLevel: 5,
  },
  {
    id: 114,
    category: "Ícones",
    slot: "icon",
    name: "T-Rex Feroz",
    icon: "🦖",
    price: 2500,
    rarity: "lendario",
    color: "text-red-500",
    minLevel: 6,
  },
  {
    id: 115,
    category: "Ícones",
    slot: "icon",
    name: "Sol Supremo",
    icon: "🌞",
    price: 3000,
    rarity: "lendario",
    color: "text-yellow-400",
    minLevel: 6,
  },

  // Molduras
  {
    id: 201,
    category: "Molduras",
    slot: "frame",
    name: "Madeira",
    icon: "🟫",
    style: "border-[6px] sm:border-[8px] border-amber-800",
    price: 150,
    rarity: "comum",
    minLevel: 1,
  },
  {
    id: 202,
    category: "Molduras",
    slot: "frame",
    name: "Folhas",
    icon: "🍃",
    style: "border-[6px] sm:border-[8px] border-green-600 border-dashed",
    price: 200,
    rarity: "comum",
    minLevel: 1,
  },
  {
    id: 211,
    category: "Molduras",
    slot: "frame",
    name: "Gelo Quebrado",
    icon: "🧊",
    style:
      "border-[6px] sm:border-[8px] border-blue-200 border-dashed shadow-[0_0_10px_rgba(191,219,254,0.5)]",
    price: 200,
    rarity: "comum",
    minLevel: 1,
  },
  {
    id: 212,
    category: "Molduras",
    slot: "frame",
    name: "Teia de Aranha",
    icon: "🕸️",
    style:
      "border-[4px] sm:border-[6px] border-gray-400 border-dotted shadow-[0_0_8px_rgba(156,163,175,0.4)]",
    price: 250,
    rarity: "comum",
    minLevel: 1,
  },
  {
    id: 203,
    category: "Molduras",
    slot: "frame",
    name: "Prata",
    icon: "⚪",
    style:
      "border-[6px] sm:border-[8px] border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.6)]",
    price: 300,
    rarity: "raro",
    minLevel: 2,
  },
  {
    id: 204,
    category: "Molduras",
    slot: "frame",
    name: "Nuvens",
    icon: "☁️",
    style: "border-[8px] sm:border-[10px] border-sky-200 border-dotted",
    price: 400,
    rarity: "raro",
    minLevel: 2,
  },
  {
    id: 213,
    category: "Molduras",
    slot: "frame",
    name: "Corda",
    icon: "🪢",
    style:
      "border-[6px] sm:border-[8px] border-yellow-700 shadow-[0_0_12px_rgba(161,98,7,0.5)]",
    price: 350,
    rarity: "raro",
    minLevel: 2,
  },
  {
    id: 216,
    category: "Molduras",
    slot: "frame",
    name: "Correntes de Aço",
    icon: "⛓️",
    style:
      "border-[6px] sm:border-[8px] border-slate-500 shadow-[0_0_10px_rgba(100,116,139,0.8)]",
    price: 400,
    rarity: "raro",
    minLevel: 2,
  },
  {
    id: 205,
    category: "Molduras",
    slot: "frame",
    name: "Ouro",
    icon: "🟡",
    style:
      "border-[6px] sm:border-[8px] border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]",
    price: 600,
    rarity: "epico",
    minLevel: 3,
  },
  {
    id: 206,
    category: "Molduras",
    slot: "frame",
    name: "Arco-Íris",
    icon: "🌈",
    style:
      "border-[6px] sm:border-[8px] border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.5),inset_0_0_15px_rgba(217,70,239,0.3)]",
    price: 900,
    rarity: "epico",
    minLevel: 3,
  },
  {
    id: 214,
    category: "Molduras",
    slot: "frame",
    name: "Sangue Vampírico",
    icon: "🩸",
    style:
      "border-[6px] sm:border-[8px] border-red-700 shadow-[0_0_18px_rgba(185,28,28,0.7)]",
    price: 700,
    rarity: "epico",
    minLevel: 3,
  },
  {
    id: 207,
    category: "Molduras",
    slot: "frame",
    name: "Diamante",
    icon: "💎",
    style:
      "border-[6px] sm:border-[8px] border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]",
    price: 1200,
    rarity: "lendario",
    minLevel: 4,
  },
  {
    id: 215,
    category: "Molduras",
    slot: "frame",
    name: "Neon Cósmico",
    icon: "💫",
    style:
      "border-[6px] sm:border-[8px] border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.9),inset_0_0_15px_rgba(168,85,247,0.6)]",
    price: 1500,
    rarity: "lendario",
    minLevel: 4,
  },
  {
    id: 208,
    category: "Molduras",
    slot: "frame",
    name: "Fogo Ardente",
    icon: "🔥",
    style:
      "border-[6px] sm:border-[8px] border-orange-600 shadow-[0_0_25px_rgba(234,88,12,0.9),inset_0_0_15px_rgba(234,88,12,0.5)]",
    price: 1800,
    rarity: "lendario",
    minLevel: 5,
  },
  {
    id: 209,
    category: "Molduras",
    slot: "frame",
    name: "Neon Tóxico",
    icon: "☣️",
    style:
      "border-[6px] sm:border-[8px] border-lime-500 shadow-[0_0_30px_rgba(132,204,22,1),inset_0_0_20px_rgba(132,204,22,0.8)]",
    price: 2500,
    rarity: "lendario",
    minLevel: 6,
  },
  {
    id: 210,
    category: "Molduras",
    slot: "frame",
    name: "Energia Pura",
    icon: "⚡",
    style:
      "border-[6px] sm:border-[8px] border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,1),inset_0_0_20px_rgba(99,102,241,0.8)]",
    price: 3500,
    rarity: "lendario",
    minLevel: 6,
  },

  // Títulos
  {
    id: 301,
    category: "Títulos",
    slot: "title",
    name: "Estudioso(a)",
    icon: "📖",
    text: "O/A Estudioso(a)",
    price: 100,
    rarity: "comum",
    color: "text-blue-300",
    minLevel: 1,
  },
  {
    id: 302,
    category: "Títulos",
    slot: "title",
    name: "Aventureiro(a)",
    icon: "🧭",
    text: "Aventureiro(a)",
    price: 200,
    rarity: "comum",
    color: "text-orange-300",
    minLevel: 1,
  },
  {
    id: 303,
    category: "Títulos",
    slot: "title",
    name: "Detetive",
    icon: "🔍",
    text: "Detetive Escolar",
    price: 400,
    rarity: "raro",
    color: "text-slate-300",
    minLevel: 2,
  },
  {
    id: 304,
    category: "Títulos",
    slot: "title",
    name: "Amigo da Natureza",
    icon: "🌳",
    text: "Amigo da Natureza",
    price: 450,
    rarity: "raro",
    color: "text-emerald-300",
    minLevel: 2,
  },
  {
    id: 305,
    category: "Títulos",
    slot: "title",
    name: "Gênio",
    icon: "🧠",
    text: "Gênio da Lógica",
    price: 800,
    rarity: "epico",
    color: "text-purple-300",
    minLevel: 3,
  },
  {
    id: 306,
    category: "Títulos",
    slot: "title",
    name: "Encantador",
    icon: "✨",
    text: "Encantador de Corações",
    price: 900,
    rarity: "epico",
    color: "text-pink-300",
    minLevel: 3,
  },
  {
    id: 307,
    category: "Títulos",
    slot: "title",
    name: "Mestre da Magia",
    icon: "🔮",
    text: "Mestre da Magia",
    price: 1500,
    rarity: "epico",
    color: "text-fuchsia-400",
    minLevel: 4,
  },
  {
    id: 308,
    category: "Títulos",
    slot: "title",
    name: "A Lenda Viva",
    icon: "🌟",
    text: "A Lenda Viva",
    price: 2500,
    rarity: "lendario",
    color: "text-yellow-300",
    minLevel: 5,
  },
  {
    id: 309,
    category: "Títulos",
    slot: "title",
    name: "Guardião Celeste",
    icon: "⚡",
    text: "Guardião Celeste",
    price: 5000,
    rarity: "lendario",
    color: "text-yellow-400",
    minLevel: 6,
  },

  // Fundos
  {
    id: 401,
    category: "Fundos",
    slot: "background",
    name: "Noite",
    icon: "🌙",
    style: "bg-slate-900",
    price: 100,
    rarity: "comum",
    minLevel: 1,
  },
  {
    id: 402,
    category: "Fundos",
    slot: "background",
    name: "Floresta",
    icon: "🌲",
    style: "bg-gradient-to-br from-green-900 to-slate-900",
    price: 250,
    rarity: "comum",
    minLevel: 1,
  },
  {
    id: 403,
    category: "Fundos",
    slot: "background",
    name: "Jardim",
    icon: "🌻",
    style: "bg-gradient-to-br from-lime-800 to-emerald-900",
    price: 300,
    rarity: "comum",
    minLevel: 1,
  },
  {
    id: 414,
    category: "Fundos",
    slot: "background",
    name: "Pântano Sombrio",
    icon: "🐊",
    style: "bg-gradient-to-br from-green-950 via-emerald-950 to-black",
    price: 150,
    rarity: "comum",
    minLevel: 1,
  },
  {
    id: 415,
    category: "Fundos",
    slot: "background",
    name: "Cemitério",
    icon: "🪦",
    style: "bg-gradient-to-t from-gray-900 via-gray-800 to-slate-900",
    price: 200,
    rarity: "comum",
    minLevel: 1,
  },
  {
    id: 404,
    category: "Fundos",
    slot: "background",
    name: "Oceano",
    icon: "🌊",
    style: "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
    price: 500,
    rarity: "raro",
    minLevel: 2,
  },
  {
    id: 411,
    category: "Fundos",
    slot: "background",
    name: "Aurora",
    icon: "✨",
    style: "bg-gradient-to-t from-emerald-900 via-teal-900 to-slate-900",
    price: 600,
    rarity: "raro",
    minLevel: 2,
  },
  {
    id: 412,
    category: "Fundos",
    slot: "background",
    name: "Pôr do Sol",
    icon: "🌅",
    style: "bg-gradient-to-t from-orange-600 via-red-900 to-purple-900",
    price: 700,
    rarity: "raro",
    minLevel: 2,
  },
  {
    id: 405,
    category: "Fundos",
    slot: "background",
    name: "Céu Rosa",
    icon: "🌸",
    style: "bg-gradient-to-br from-pink-800 via-fuchsia-900 to-slate-900",
    price: 600,
    rarity: "raro",
    minLevel: 2,
  },
  {
    id: 416,
    category: "Fundos",
    slot: "background",
    name: "Caverna de Cristal",
    icon: "💎",
    style: "bg-gradient-to-br from-cyan-950 via-blue-900 to-indigo-950",
    price: 400,
    rarity: "raro",
    minLevel: 2,
  },
  {
    id: 417,
    category: "Fundos",
    slot: "background",
    name: "Tempestade",
    icon: "🌩️",
    style: "bg-gradient-to-b from-slate-900 via-gray-800 to-zinc-900",
    price: 500,
    rarity: "raro",
    minLevel: 2,
  },
  {
    id: 406,
    category: "Fundos",
    slot: "background",
    name: "Vulcão",
    icon: "🌋",
    style: "bg-gradient-to-br from-red-900 via-orange-900 to-black",
    price: 800,
    rarity: "epico",
    minLevel: 3,
  },
  {
    id: 413,
    category: "Fundos",
    slot: "background",
    name: "Reino Fada",
    icon: "🧚",
    style: "bg-gradient-to-br from-pink-400 via-fuchsia-600 to-purple-800",
    price: 1000,
    rarity: "epico",
    minLevel: 3,
  },
  {
    id: 418,
    category: "Fundos",
    slot: "background",
    name: "Inferno",
    icon: "🔥",
    style: "bg-gradient-to-t from-red-950 via-orange-950 to-black",
    price: 900,
    rarity: "epico",
    minLevel: 3,
  },
  {
    id: 407,
    category: "Fundos",
    slot: "background",
    name: "Matrix",
    icon: "💻",
    style:
      "bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#0f172a_2px,#0f172a_4px)] bg-green-950",
    price: 1200,
    rarity: "epico",
    minLevel: 4,
  },
  {
    id: 408,
    category: "Fundos",
    slot: "background",
    name: "Galáxia",
    icon: "🌌",
    style: "bg-gradient-to-br from-purple-900 via-indigo-950 to-black",
    price: 2000,
    rarity: "lendario",
    minLevel: 5,
  },
  {
    id: 419,
    category: "Fundos",
    slot: "background",
    name: "Portal Dimensional",
    icon: "🌀",
    style: "bg-gradient-to-br from-violet-900 via-fuchsia-900 to-purple-950",
    price: 2500,
    rarity: "lendario",
    minLevel: 5,
  },
  {
    id: 409,
    category: "Fundos",
    slot: "background",
    name: "Cyberpunk",
    icon: "🌆",
    style: "bg-gradient-to-br from-fuchsia-900 via-purple-900 to-blue-900",
    price: 3000,
    rarity: "lendario",
    minLevel: 6,
  },
  {
    id: 410,
    category: "Fundos",
    slot: "background",
    name: "Ouro Puro",
    icon: "✨",
    style:
      "bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 shadow-[inset_0_0_60px_rgba(180,83,9,0.6)]",
    price: 5000,
    rarity: "lendario",
    minLevel: 6,
  },
  {
    id: 420,
    category: "Fundos",
    slot: "background",
    name: "Hiperespaço",
    icon: "☄️",
    style:
      "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-indigo-950 to-black",
    price: 1500,
    rarity: "lendario",
    minLevel: 4,
  },
];

const getLevelInfo = (xp = 0) => {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || LEVELS[i];
    }
  }

  if (currentLevel.id === LEVELS[LEVELS.length - 1].id) {
    return {
      currentLevel,
      nextLevel: currentLevel,
      progress: 100,
      isMax: true,
    };
  }

  const progress = Math.floor(
    ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100
  );
  return { currentLevel, nextLevel, progress, isMax: false };
};

const getRarityBadge = (rarity) => {
  const styles = {
    comum: "bg-slate-700 text-slate-300 border-slate-500",
    raro: "bg-blue-900/80 text-blue-300 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]",
    epico:
      "bg-purple-900/80 text-purple-300 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]",
    lendario:
      "bg-yellow-900/80 text-yellow-300 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]",
  };
  return (
    <span
      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${styles[rarity]}`}
    >
      {rarity}
    </span>
  );
};

const getStreakInfo = (submissions = [], studentId) => {
  if (!studentId || !Array.isArray(submissions) || submissions.length === 0)
    return { currentStreak: 0, bestStreak: 0, lastActive: null };

  const studentSubs = submissions.filter(
    (s) => s?.studentId === studentId && s?.date
  );
  if (studentSubs.length === 0)
    return { currentStreak: 0, bestStreak: 0, lastActive: null };

  const datesStr = [
    ...new Set(
      studentSubs
        .map((s) => {
          const parts = s.date.split("/");
          if (parts.length !== 3) return null;
          const [d, m, y] = parts;
          return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        })
        .filter(Boolean)
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  if (datesStr.length === 0)
    return { currentStreak: 0, bestStreak: 0, lastActive: null };

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

  let expectedNext = null;

  for (let i = datesStr.length - 1; i >= 0; i--) {
    const dateStr = datesStr[i];
    const currDate = new Date(dateStr);

    if (expectedNext === null) {
      tempStreak = 1;
    } else {
      const diffTime = Math.abs(currDate - expectedNext);
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > bestStreak) bestStreak = tempStreak;
    expectedNext = currDate;
  }

  if (datesStr[0] === todayStr || datesStr[0] === yesterdayStr) {
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }

  return { currentStreak, bestStreak, lastActive: datesStr[0] };
};

const PlayerCard = ({
  student,
  size = "md",
  customEquipped = null,
  isEmptyMannequin = false,
  disableHover = false,
}) => {
  const safeStudent = student || {};
  const equipped = isEmptyMannequin
    ? {}
    : customEquipped || safeStudent.equipped || {};
  const studentLevelInfo = getLevelInfo(safeStudent.xp || 0);
  const currentLevel = studentLevelInfo.currentLevel;

  const getItem = (id) => STORE_ITEMS.find((i) => i.id === id);
  const iconItem = getItem(equipped.icon);
  const frameItem = getItem(equipped.frame);
  const titleItem = getItem(equipped.title);
  const bgItem = getItem(equipped.background);

  const bgStyle = bgItem
    ? bgItem.style
    : isEmptyMannequin
    ? "bg-transparent"
    : "bg-slate-800";
  const frameStyle = frameItem
    ? frameItem.style
    : isEmptyMannequin
    ? "border-dashed border-[3px] border-slate-700/50"
    : "border-[4px] border-slate-700/50";
  const displayIcon = iconItem ? iconItem.icon : isEmptyMannequin ? "" : "👤";

  const sizes = {
    sm: {
      cardPadding: "p-2 sm:p-3",
      iconSize: "text-2xl sm:text-4xl",
      w: "w-16 sm:w-24",
      minH: "min-h-[4rem] sm:min-h-[6rem]",
    },
    md: {
      cardPadding: "p-2 sm:p-5",
      iconSize: "text-4xl sm:text-6xl",
      w: "w-28 sm:w-44",
      minH: "min-h-[7rem] sm:min-h-[11rem]",
    },
    lg: {
      cardPadding: "p-4 sm:p-8",
      iconSize: "text-[4rem] sm:text-[6rem]",
      w: "w-full max-w-[200px] sm:max-w-[280px]",
      minH: "min-h-[12rem] sm:min-h-[16rem]",
    },
    xl: {
      cardPadding: "p-6 sm:p-10",
      iconSize: "text-[5rem] sm:text-[8rem]",
      w: "w-full max-w-[240px] sm:max-w-[320px]",
      minH: "min-h-[14rem] sm:min-h-[20rem]",
    },
  };
  const s = sizes[size];

  // Lógica de cálculo da quantidade de Emojis para ocupar toda a borda
  let eH = 8,
    eV = 6;
  if (size === "sm") {
    eH = 6;
    eV = 4;
  } else if (size === "md") {
    eH = 10;
    eV = 8;
  } else if (size === "lg") {
    eH = 14;
    eV = 12;
  } else if (size === "xl") {
    eH = 18;
    eV = 16;
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${
        s.cardPadding
      } ${
        s.w
      } rounded-2xl md:rounded-3xl transition-all shadow-xl shrink-0 overflow-hidden ${
        s.minH
      } ${disableHover ? "" : "hover:scale-[1.02]"}`}
    >
      <div className={`absolute inset-0 z-0 ${bgStyle}`}></div>
      <div
        className={`absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none z-20 ${frameStyle}`}
      ></div>

      {/* Emojis Decorando toda a borda da Moldura */}
      {frameItem && frameItem.icon && !isEmptyMannequin && (
        <div className="absolute inset-0 flex flex-col justify-between z-30 pointer-events-none rounded-2xl md:rounded-3xl overflow-hidden p-[1px] sm:p-[2px]">
          {/* Linha Superior */}
          <div className="flex justify-around w-full text-[6px] sm:text-[10px] md:text-[14px] drop-shadow-md leading-none mt-0.5">
            {Array.from({ length: eH }).map((_, i) => (
              <span key={`t-${i}`}>{frameItem.icon}</span>
            ))}
          </div>
          {/* Linhas Laterais */}
          <div className="flex-1 flex justify-between w-full overflow-hidden">
            <div className="flex flex-col justify-around h-full text-[6px] sm:text-[10px] md:text-[14px] drop-shadow-md leading-none ml-0.5">
              {Array.from({ length: eV }).map((_, i) => (
                <span key={`l-${i}`}>{frameItem.icon}</span>
              ))}
            </div>
            <div className="flex flex-col justify-around h-full text-[6px] sm:text-[10px] md:text-[14px] drop-shadow-md leading-none mr-0.5">
              {Array.from({ length: eV }).map((_, i) => (
                <span key={`r-${i}`}>{frameItem.icon}</span>
              ))}
            </div>
          </div>
          {/* Linha Inferior */}
          <div className="flex justify-around w-full text-[6px] sm:text-[10px] md:text-[14px] drop-shadow-md leading-none mb-0.5">
            {Array.from({ length: eH }).map((_, i) => (
              <span key={`b-${i}`}>{frameItem.icon}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center relative z-10 w-full min-h-[1em]">
        {displayIcon ? (
          <span
            className={`${s.iconSize} drop-shadow-xl filter brightness-110 block relative z-10`}
          >
            {displayIcon}
          </span>
        ) : (
          isEmptyMannequin && (
            <span className="text-3xl sm:text-4xl opacity-20 block relative z-10">
              ❔
            </span>
          )
        )}
      </div>

      {size !== "sm" && !isEmptyMannequin && (
        <div className="mt-2 sm:mt-4 text-center w-full relative z-10">
          <h3 className="font-black text-white text-xs sm:text-lg leading-tight truncate px-1 sm:px-2">
            {(safeStudent.name || "Aluno").split(" ")[0]}
          </h3>
          <div
            className={`mt-1 sm:mt-2 mx-auto w-[98%] max-w-[98%] px-1 sm:px-2 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-black/50 backdrop-blur-sm border border-white/20 shadow-inner ${
              titleItem ? titleItem.color : "text-slate-300"
            } font-black text-[6.5px] sm:text-[8px] md:text-[9px] uppercase tracking-widest whitespace-normal break-words leading-tight flex items-center justify-center text-center min-h-[1.5rem]`}
          >
            {titleItem ? titleItem.text : "Novato(a)"}
          </div>
          <div className="mt-1.5 sm:mt-3 inline-flex items-center gap-1 sm:gap-1.5 bg-black/60 border border-white/10 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-bold text-slate-200">
            {currentLevel.icon} Nvl. {currentLevel.id}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomModal = ({ modal, setModal }) => {
  if (!modal.isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="text-4xl md:text-5xl mb-4 animate-bounce relative z-10">
          {modal.type === "confirm" ? "⚠️" : "🔔"}
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white mb-2 relative z-10">
          {modal.title}
        </h3>
        <div className="text-slate-300 mb-6 md:mb-8 font-medium text-sm md:text-lg leading-snug relative z-10">
          {modal.message}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center relative z-10">
          {modal.type === "confirm" ? (
            <>
              <button
                onClick={() => setModal({ isOpen: false })}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 md:py-4 rounded-xl transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (modal.onConfirm) modal.onConfirm();
                  setModal({ isOpen: false });
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 md:py-4 rounded-xl transition-colors shadow-lg text-sm"
              >
                Confirmar
              </button>
            </>
          ) : (
            <button
              onClick={() => setModal({ isOpen: false })}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 md:py-4 rounded-xl transition-colors shadow-lg uppercase tracking-wider text-sm"
            >
              Entendi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState("login_select");
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [students, setStudents] = useState([]);
  const [missions, setMissions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [loggedInStudent, setLoggedInStudent] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [studentObjAnswer, setStudentObjAnswer] = useState(null);
  const [missionAttempts, setMissionAttempts] = useState(0);
  const [earnedRewards, setEarnedRewards] = useState({ xp: 0, coins: 0 });
  const [lastCompletedMission, setLastCompletedMission] = useState(null);
  const [lastStudentAnswer, setLastStudentAnswer] = useState("");

  const [studentTab, setStudentTab] = useState("missions");
  const [storeCategory, setStoreCategory] = useState("Ícones");
  const [ficharioTab, setFicharioTab] = useState("equip");
  const [ficharioCategory, setFicharioCategory] = useState("Ícones");
  const [previewEquipped, setPreviewEquipped] = useState({});
  const [rankingCategory, setRankingCategory] = useState("xp");

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  const [teacherTab, setTeacherTab] = useState("missions");
  const [editingMissionId, setEditingMissionId] = useState(null);
  const [printData, setPrintData] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [teacherAuth, setTeacherAuth] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");

  const [newMission, setNewMission] = useState({
    title: "",
    subject: "Língua Portuguesa",
    bookReference: "",
    prompt: "",
    skills: "",
    imageUrl: "",
    xp: 100,
    coins: 50,
    format: "open",
    keywords: "",
    expectedAnswer: "",
    opt1: "",
    opt2: "",
    opt3: "",
    opt4: "",
    correctOpt: 0,
    targetType: "all",
    targetStudents: [],
  });

  const [newStudent, setNewStudent] = useState({
    name: "",
    username: "",
    password: "",
  });

  const showMsg = (title, message) =>
    setModal({ isOpen: true, title, message, type: "info", onConfirm: null });
  const showConfirm = (title, message, onConfirm) =>
    setModal({ isOpen: true, title, message, type: "confirm", onConfirm });

  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    let unsubStudents, unsubMissions, unsubSubmissions, unsubAuth;

    try {
      unsubStudents = onSnapshot(
        collection(db, "cp_students"),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setStudents(
            data.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
          );
        },
        () => {
          setIsLoading(false);
        }
      );

      unsubMissions = onSnapshot(
        collection(db, "cp_missions"),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMissions(
            data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          );
        },
        () => {
          setIsLoading(false);
        }
      );

      unsubSubmissions = onSnapshot(
        collection(db, "cp_submissions"),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSubmissions(data);
          setIsLoading(false);
          clearTimeout(fallbackTimer);
        },
        () => {
          setIsLoading(false);
          clearTimeout(fallbackTimer);
        }
      );

      unsubAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          setView((prev) =>
            prev === "login_teacher" || prev === "login_select"
              ? "teacher_dash"
              : prev
          );
        }
      });
    } catch (e) {
      setIsLoading(false);
    }

    return () => {
      clearTimeout(fallbackTimer);
      if (unsubStudents) unsubStudents();
      if (unsubMissions) unsubMissions();
      if (unsubSubmissions) unsubSubmissions();
      if (unsubAuth) unsubAuth();
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.volume = 0.35;
      if (audioRef.current.readyState === 0) {
        audioRef.current.load(); // Força load se estiver travado
      }
      audioRef.current
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((e) => {
          console.log("Áudio bloqueado ou erro no link:", e);
          showMsg(
            "Áudio Bloqueado",
            "O navegador reteve a música automática. Clique no botão de som para liberar!"
          );
        });
    }
  };

  const forcePlayMusic = () => {
    if (audioRef.current && !isMusicPlaying) {
      audioRef.current.volume = 0.35;
      audioRef.current
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((err) => {
          console.log("Navegador reteve autoplay", err);
        });
    }
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    const student = students.find(
      (s) =>
        s.username === loginForm.username && s.password === loginForm.password
    );
    if (student) {
      setLoggedInStudent(student);
      setAuthError("");
      setLoginForm({ username: "", password: "" });
      setView("student_dash");
      forcePlayMusic();
    } else {
      setAuthError("Usuário ou senha incorretos!");
    }
  };

  const handleTeacherLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      await signInWithEmailAndPassword(
        auth,
        teacherAuth.email,
        teacherAuth.password
      );
      setView("teacher_dash");
    } catch (error) {
      setAuthError("E-mail ou senha incorretos.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setLoggedInStudent(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
    setView("login_select");
  };

  const submitMission = async () => {
    if (activeMission.format === "open") {
      if (!studentAnswer.trim()) return;
      if (activeMission.keywords && activeMission.keywords.trim() !== "") {
        const requiredWords = activeMission.keywords
          .split(",")
          .map((k) => k.trim().toLowerCase())
          .filter((k) => k);
        const answerLower = studentAnswer.toLowerCase();
        const hasMatch = requiredWords.some((word) =>
          answerLower.includes(word)
        );

        if (!hasMatch && requiredWords.length > 0) {
          setMissionAttempts((prev) => prev + 1);
          showMsg(
            "Faltam Detalhes!",
            `Sua resposta não abordou os pontos principais e você perdeu parte da recompensa. Leia o material e tente usar os termos: ${requiredWords.join(
              ", "
            )}`
          );
          return;
        }
      }
    } else {
      if (studentObjAnswer === null)
        return showMsg("Atenção", "Selecione uma alternativa antes de enviar!");
      if (studentObjAnswer !== activeMission.correctOpt) {
        setMissionAttempts((prev) => prev + 1);
        showMsg(
          "Resposta Incorreta",
          "Ops! A alternativa está incorreta. Você perdeu parte da recompensa. Leia com atenção e tente novamente!"
        );
        return;
      }
    }

    let multiplier = 1;
    if (missionAttempts > 0) {
      multiplier = Math.max(0.4, 1 - missionAttempts * 0.3);
    }

    const finalXp = Math.round((activeMission.xp || 0) * multiplier);
    const finalCoins = Math.round((activeMission.coins || 0) * multiplier);
    const finalAnswer =
      activeMission.format === "open"
        ? studentAnswer
        : activeMission.options
        ? activeMission.options[studentObjAnswer]
        : "Opção Selecionada";

    const submissionData = {
      studentId: loggedInStudent.id,
      studentName: loggedInStudent.name,
      missionId: activeMission.id,
      missionTitle: activeMission.title,
      subject: activeMission.subject,
      bookReference: activeMission.bookReference,
      prompt: activeMission.prompt,
      skills: activeMission.skills,
      answer: finalAnswer,
      imageUrl: activeMission.imageUrl || "",
      xpGained: finalXp,
      coinsGained: finalCoins,
      date: new Date().toLocaleDateString("pt-BR"),
      timestamp: Date.now(),
    };

    setLastCompletedMission(activeMission);
    setLastStudentAnswer(finalAnswer);

    await addDoc(collection(db, "cp_submissions"), submissionData);

    const studentRef = doc(db, "cp_students", loggedInStudent.id);
    await updateDoc(studentRef, {
      xp: (loggedInStudent.xp || 0) + finalXp,
      coins: (loggedInStudent.coins || 0) + finalCoins,
    });

    setLoggedInStudent((prev) => ({
      ...prev,
      xp: (prev.xp || 0) + finalXp,
      coins: (prev.coins || 0) + finalCoins,
    }));
    setEarnedRewards({ xp: finalXp, coins: finalCoins });
    setStudentAnswer("");
    setStudentObjAnswer(null);
    setView("student_success");
  };

  const buyItem = async (item) => {
    const currentInventory = loggedInStudent.inventory || [];
    if (
      (loggedInStudent.coins || 0) >= item.price &&
      !currentInventory.includes(item.id)
    ) {
      const newCoins = (loggedInStudent.coins || 0) - item.price;
      const newInventory = [...currentInventory, item.id];

      const studentRef = doc(db, "cp_students", loggedInStudent.id);
      await updateDoc(studentRef, { coins: newCoins, inventory: newInventory });

      setLoggedInStudent((prev) => ({
        ...prev,
        coins: newCoins,
        inventory: newInventory,
      }));
      showMsg(
        "Compra Realizada! 🛍️",
        `A peça '${item.name}' foi enviada para sua Mochila. Vá até a aba Fichário para montar seu visual e salvar!`
      );
    }
  };

  const equipItem = async (item) => {
    const isCurrentlyEquipped =
      (loggedInStudent.equipped || {})[item.slot] === item.id;
    const newEquipped = {
      ...(loggedInStudent.equipped || {}),
      [item.slot]: isCurrentlyEquipped ? null : item.id,
    };
    const studentRef = doc(db, "cp_students", loggedInStudent.id);
    await updateDoc(studentRef, { equipped: newEquipped });
    setLoggedInStudent((prev) => ({ ...prev, equipped: newEquipped }));
  };

  const handlePreviewItem = (item) => {
    const newPreview = { ...previewEquipped, [item.slot]: item.id };
    setPreviewEquipped(newPreview);
  };

  const clearPreview = () => {
    setPreviewEquipped({});
  };

  const saveDeck = async () => {
    const currentDecks = loggedInStudent.decks || [];
    const newDeck = {
      id: Date.now(),
      equipped: loggedInStudent.equipped || {},
    };
    const updatedDecks = [...currentDecks, newDeck];

    const studentRef = doc(db, "cp_students", loggedInStudent.id);
    await updateDoc(studentRef, { decks: updatedDecks });
    setLoggedInStudent((prev) => ({ ...prev, decks: updatedDecks }));
    showMsg(
      "Card Salvo!",
      "A combinação foi salva na sua coleção do Fichário."
    );
  };

  const equipDeck = async (deckEquipped) => {
    const studentRef = doc(db, "cp_students", loggedInStudent.id);
    await updateDoc(studentRef, { equipped: deckEquipped });
    setLoggedInStudent((prev) => ({ ...prev, equipped: deckEquipped }));
    showMsg(
      "Visual Alterado!",
      "Seu avatar foi atualizado com o card selecionado."
    );
  };

  const deleteDeck = async (deckId) => {
    const updatedDecks = (loggedInStudent.decks || []).filter(
      (d) => d.id !== deckId
    );
    const studentRef = doc(db, "cp_students", loggedInStudent.id);
    await updateDoc(studentRef, { decks: updatedDecks });
    setLoggedInStudent((prev) => ({ ...prev, decks: updatedDecks }));
  };

  const sendGift = async (receiverId, deckEquipped) => {
    const receiver = students.find((s) => s.id === receiverId);
    if (!receiver) return;

    const receiverGifts = receiver.gifts || [];
    const newGift = {
      id: Date.now(),
      fromName: loggedInStudent.name,
      equipped: deckEquipped,
    };
    const updatedGifts = [...receiverGifts, newGift];

    const receiverRef = doc(db, "cp_students", receiverId);
    await updateDoc(receiverRef, { gifts: updatedGifts });

    const senderRef = doc(db, "cp_students", loggedInStudent.id);
    const newGiftsSent = (loggedInStudent.giftsSent || 0) + 1;
    await updateDoc(senderRef, { giftsSent: newGiftsSent });
    setLoggedInStudent((prev) => ({ ...prev, giftsSent: newGiftsSent }));

    showMsg(
      "Presente Enviado! 🎁",
      `Você enviou o visual de presente para ${
        (receiver.name || "Aluno").split(" ")[0]
      }!`
    );
  };

  const syncStudentsFromOtherPlatform = async () => {
    showConfirm(
      "Importar Alunos?",
      "Buscar alunos da Plataforma original e cadastrá-los aqui?",
      async () => {
        try {
          const docRef = doc(db, "platform_data", "students");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const platformStudents = docSnap.data().list || [];
            let addedCount = 0;
            for (const ps of platformStudents) {
              const loginFormat = (ps.login || "")
                .toLowerCase()
                .replace(/\s/g, "");
              if (
                loginFormat &&
                !students.find((s) => s.username === loginFormat)
              ) {
                const studentData = {
                  name: (ps.name || "Aluno").toUpperCase(),
                  username: loginFormat,
                  password: ps.pass || "1234",
                  xp: 0,
                  coins: 0,
                  inventory: [],
                  equipped: {},
                  decks: [],
                  gifts: [],
                  giftsSent: 0,
                  createdAt: Date.now(),
                };
                await addDoc(collection(db, "cp_students"), studentData);
                addedCount++;
              }
            }
            showMsg(
              "Sincronização Concluída",
              `${addedCount} novos alunos importados com sucesso!`
            );
          } else {
            showMsg("Erro", "Lista não encontrada no Firebase.");
          }
        } catch (e) {
          showMsg("Erro de Conexão", e.message);
        }
      }
    );
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const loginFormat = (newStudent.username || "")
      .toLowerCase()
      .replace(/\s/g, "");
    if (students.find((s) => s.username === loginFormat))
      return showMsg("Erro", "Login já existe!");

    const studentData = {
      name: (newStudent.name || "").toUpperCase(),
      username: loginFormat,
      password: newStudent.password,
      xp: 0,
      coins: 0,
      inventory: [],
      equipped: {},
      decks: [],
      gifts: [],
      giftsSent: 0,
      createdAt: Date.now(),
    };
    await addDoc(collection(db, "cp_students"), studentData);
    setNewStudent({ name: "", username: "", password: "" });
    showMsg("Sucesso", "Aluno matriculado no Aura XP!");
  };

  const handleDeleteStudent = async (id, name) => {
    showConfirm(
      "Excluir Aluno",
      `Tem certeza que deseja apagar o acesso de ${name}?`,
      async () => {
        await deleteDoc(doc(db, "cp_students", id));
      }
    );
  };

  const handleAddMission = async (e) => {
    e.preventDefault();
    if (
      newMission.targetType === "specific" &&
      newMission.targetStudents.length === 0
    ) {
      return showMsg(
        "Erro",
        "Você escolheu 'Alunos Específicos', mas não selecionou nenhum aluno."
      );
    }

    let missionData = {
      title: newMission.title,
      subject: newMission.subject,
      bookReference: newMission.bookReference,
      prompt: newMission.prompt,
      skills: newMission.skills,
      xp: parseInt(newMission.xp) || 0,
      coins: parseInt(newMission.coins) || 0,
      format: newMission.format,
      icon: "🎯",
      color: "from-indigo-600 to-blue-500",
      imageUrl: newMission.imageUrl || "",
      targetType: newMission.targetType,
      targetStudents:
        newMission.targetType === "specific" ? newMission.targetStudents : [],
    };

    if (newMission.format === "objective") {
      if (!newMission.opt1 || !newMission.opt2)
        return showMsg("Erro", "Preencha pelo menos as opções 1 e 2.");
      missionData.options = [
        newMission.opt1,
        newMission.opt2,
        newMission.opt3,
        newMission.opt4,
      ].filter((o) => o.trim() !== "");
      missionData.correctOpt = parseInt(newMission.correctOpt);
    } else {
      missionData.keywords = newMission.keywords;
      missionData.expectedAnswer = newMission.expectedAnswer;
    }

    if (editingMissionId) {
      await updateDoc(doc(db, "cp_missions", editingMissionId), missionData);
      setEditingMissionId(null);
      showMsg(
        "Missão Atualizada!",
        "As alterações foram salvas no Banco de Missões."
      );
    } else {
      missionData.createdAt = Date.now();
      missionData.status = "draft";
      await addDoc(collection(db, "cp_missions"), missionData);
      showMsg(
        "Salvo no Banco!",
        "Atividade salva como RASCUNHO. Clique em 'Publicar' no Banco de Missões quando quiser enviar para a turma."
      );
    }

    setNewMission({
      title: "",
      subject: "Língua Portuguesa",
      bookReference: "",
      prompt: "",
      skills: "",
      imageUrl: "",
      xp: 100,
      coins: 50,
      format: "open",
      keywords: "",
      expectedAnswer: "",
      opt1: "",
      opt2: "",
      opt3: "",
      opt4: "",
      correctOpt: 0,
      targetType: "all",
      targetStudents: [],
    });
  };

  const handleEditMission = (mission) => {
    setNewMission({
      title: mission.title || "",
      subject: mission.subject || "Língua Portuguesa",
      bookReference: mission.bookReference || "",
      prompt: mission.prompt || "",
      skills: mission.skills || "",
      xp: mission.xp || 0,
      coins: mission.coins || 0,
      imageUrl: mission.imageUrl || "",
      format: mission.format || "open",
      keywords: mission.keywords || "",
      expectedAnswer: mission.expectedAnswer || "",
      opt1: mission.options?.[0] || "",
      opt2: mission.options?.[1] || "",
      opt3: mission.options?.[2] || "",
      opt4: mission.options?.[3] || "",
      correctOpt: mission.correctOpt || 0,
      targetType: mission.targetType || "all",
      targetStudents: mission.targetStudents || [],
    });
    setEditingMissionId(mission.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditMission = () => {
    setEditingMissionId(null);
    setNewMission({
      title: "",
      subject: "Língua Portuguesa",
      bookReference: "",
      prompt: "",
      skills: "",
      imageUrl: "",
      xp: 100,
      coins: 50,
      format: "open",
      keywords: "",
      expectedAnswer: "",
      opt1: "",
      opt2: "",
      opt3: "",
      opt4: "",
      correctOpt: 0,
      targetType: "all",
      targetStudents: [],
    });
  };

  const togglePublishMission = async (id, currentStatus) => {
    const newStatus = currentStatus === "draft" ? "published" : "draft";
    await updateDoc(doc(db, "cp_missions", id), { status: newStatus });
    showMsg(
      "Status Atualizado",
      newStatus === "published"
        ? "Missão visível para os alunos!"
        : "Missão oculta no Banco (Rascunho)."
    );
  };

  const handleDeleteMission = async (id) => {
    showConfirm(
      "Excluir Missão",
      "Remover permanentemente esta missão do banco de dados?",
      async () => {
        await deleteDoc(doc(db, "cp_missions", id));
      }
    );
  };

  const handleDeleteSubmission = async (id) => {
    showConfirm(
      "Excluir Registro",
      "Remover permanentemente a entrega deste aluno?",
      async () => {
        await deleteDoc(doc(db, "cp_submissions", id));
      }
    );
  };

  const toggleTargetStudent = (studentId) => {
    setNewMission((prev) => {
      const currentList = prev.targetStudents || [];
      const updatedList = currentList.includes(studentId)
        ? currentList.filter((id) => id !== studentId)
        : [...currentList, studentId];
      return { ...prev, targetStudents: updatedList };
    });
  };

  const safeStudent = loggedInStudent || {};
  const studentLevelInfo = getLevelInfo(safeStudent.xp || 0);
  const isMaxLevel = studentLevelInfo.isMax;

  const completedMissionIds = safeStudent.id
    ? submissions
        .filter((s) => s?.studentId === safeStudent.id)
        .map((s) => s.missionId)
    : [];

  const availableMissions = missions.filter((m) => {
    const isCompleted = completedMissionIds.includes(m.id);
    const isAllowed =
      m.targetType === "all" ||
      (m.targetType === "specific" &&
        m.targetStudents?.includes(safeStudent.id));
    const isPublished = m.status !== "draft";
    return !isCompleted && isAllowed && isPublished;
  });

  const streakInfo = getStreakInfo(submissions, safeStudent.id);
  const totalSubmissions = completedMissionIds.length;
  const totalItemsOwned = (safeStudent.inventory || []).length;
  const equippedCount = Object.values(safeStudent.equipped || {}).filter(
    (v) => v
  ).length;
  const totalDecksSaved = (safeStudent.decks || []).length;

  const ACHIEVEMENTS = [
    {
      id: "first_mission",
      title: "Primeira Missão",
      icon: "🥇",
      desc: "Concluir a primeira missão.",
      unlocked: totalSubmissions >= 1,
    },
    {
      id: "estudioso",
      title: "Estudioso",
      icon: "📚",
      desc: "Concluir 10 missões.",
      unlocked: totalSubmissions >= 10,
    },
    {
      id: "mestre_missoes",
      title: "Mestre das Missões",
      icon: "🎯",
      desc: "Concluir 25 missões.",
      unlocked: totalSubmissions >= 25,
    },
    {
      id: "six_seven",
      title: "Selo Six Seven",
      icon: "💠",
      desc: "Atingir a marca lendária de 67 missões concluídas!",
      unlocked: totalSubmissions >= 67,
    },
    {
      id: "veterano",
      title: "Veterano",
      icon: "⭐",
      desc: "Acumular 1.000 XP.",
      unlocked: (safeStudent.xp || 0) >= 1000,
    },
    {
      id: "colecionador",
      title: "Colecionador",
      icon: "💰",
      desc: "Comprar 10 itens na loja.",
      unlocked: totalItemsOwned >= 10,
    },
    {
      id: "magnata",
      title: "Magnata Escolar",
      icon: "💎",
      desc: "Adquirir 25 itens para sua mochila.",
      unlocked: totalItemsOwned >= 25,
    },
    {
      id: "personalizador",
      title: "Personalizador",
      icon: "🎨",
      desc: "Equipar um item em cada categoria.",
      unlocked: equippedCount >= 4,
    },
    {
      id: "amigo",
      title: "Amigo Generoso",
      icon: "🎁",
      desc: "Enviar um presente para outro aluno.",
      unlocked: (safeStudent.giftsSent || 0) >= 1,
    },
    {
      id: "filantropo",
      title: "Filantropo",
      icon: "🤝",
      desc: "Enviar 5 presentes para colegas.",
      unlocked: (safeStudent.giftsSent || 0) >= 5,
    },
    {
      id: "mestre_fichario",
      title: "Mestre do Fichário",
      icon: "🃏",
      desc: "Salvar 5 combinações de avatar.",
      unlocked: totalDecksSaved >= 5,
    },
    {
      id: "competidor",
      title: "Competidor",
      icon: "🏆",
      desc: "Entrar no Top 10 do ranking global.",
      unlocked:
        students
          .slice()
          .sort((a, b) => (b.xp || 0) - (a.xp || 0))
          .findIndex((s) => s.id === safeStudent.id) < 10 &&
        students.length > 0,
    },
    {
      id: "lenda",
      title: "Lenda Viva",
      icon: "🐉",
      desc: "Alcançar o nível Lenda.",
      unlocked: studentLevelInfo.currentLevel.id >= 6,
    },
    {
      id: "guardiao",
      title: "Guardião",
      icon: "⚡",
      desc: "Alcançar o nível máximo.",
      unlocked: isMaxLevel,
    },
    {
      id: "persistente",
      title: "Persistente",
      icon: "🔥",
      desc: "Alcançar 7 dias seguidos.",
      unlocked: streakInfo.bestStreak >= 7,
    },
    {
      id: "imparavel",
      title: "Imparável",
      icon: "🔥",
      desc: "Alcançar 30 dias seguidos.",
      unlocked: streakInfo.bestStreak >= 30,
    },
  ];

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const lastUnlocked = ACHIEVEMENTS.slice()
    .reverse()
    .find((a) => a.unlocked);

  const getStreakIcon = (days) => {
    if (days >= 30) return "💎";
    if (days >= 15) return "🥇";
    if (days >= 7) return "🥈";
    if (days >= 3) return "🥉";
    return "🔥";
  };

  const safeActiveMission = activeMission || {};
  const currentMultiplier =
    missionAttempts > 0 ? Math.max(0.4, 1 - missionAttempts * 0.3) : 1;
  const currentPotentialXp = Math.round(
    (safeActiveMission.xp || 0) * currentMultiplier
  );
  const currentPotentialCoins = Math.round(
    (safeActiveMission.coins || 0) * currentMultiplier
  );

  const studentsWithStats = students.map((s) => {
    const sSubmissions = submissions.filter((sub) => sub?.studentId === s.id);
    const sStreak = getStreakInfo(submissions, s.id).currentStreak;
    return {
      ...s,
      streakCount: sStreak,
      missionsCount: sSubmissions.length,
      giftsSentCount: s.giftsSent || 0,
    };
  });

  let sortedStudents = studentsWithStats.slice();
  if (rankingCategory === "xp")
    sortedStudents.sort((a, b) => (b.xp || 0) - (a.xp || 0));
  if (rankingCategory === "streak")
    sortedStudents.sort((a, b) => b.streakCount - a.streakCount);
  if (rankingCategory === "missions")
    sortedStudents.sort((a, b) => b.missionsCount - a.missionsCount);
  if (rankingCategory === "gifts")
    sortedStudents.sort((a, b) => b.giftsSentCount - a.giftsSentCount);

  const subsByStudent = {};
  submissions
    .slice()
    .reverse()
    .forEach((sub) => {
      if (!sub || !sub.studentId) return;
      if (!subsByStudent[sub.studentId]) {
        subsByStudent[sub.studentId] = {
          name: sub.studentName || "Desconhecido",
          docs: [],
        };
      }
      subsByStudent[sub.studentId].docs.push(sub);
    });

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="text-7xl mb-6 animate-bounce">🚀</div>
        <h2 className="font-bold text-2xl animate-pulse">
          Carregando Aura XP...
        </h2>
      </div>
    );

  return (
    <>
      {/* Música Arcade 8-bit com link estável Galaxy Invaders */}
      <audio
        ref={audioRef}
        loop
        src="https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3"
        preload="auto"
      />
      <CustomModal modal={modal} setModal={setModal} />

      {/* TELA DE LOGIN - SELEÇÃO */}
      {view === "login_select" && (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-6 md:mb-12 relative w-full">
            <div className="flex justify-center mb-3 md:mb-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
                <span className="text-5xl md:text-8xl relative z-10 animate-pulse drop-shadow-[0_0_40px_rgba(250,204,21,0.8)] inline-block">
                  ⭐
                </span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 mb-1 md:mb-2 uppercase tracking-tighter drop-shadow-sm leading-tight">
              Aura XP
            </h1>
            <h2 className="text-sm md:text-3xl font-black text-white uppercase tracking-widest mb-3 md:mb-4">
              Missões Escolares
            </h2>
            <p className="text-slate-400 font-bold tracking-widest text-[8px] md:text-xs uppercase bg-slate-900/50 py-1.5 md:py-2 px-3 md:px-6 rounded-full inline-block border border-slate-800">
              EM Dr. Benedito Laporte Vieira da Motta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 w-full max-w-2xl relative z-20 px-2">
            <button
              onClick={() => setView("login_student")}
              className="bg-slate-900 p-4 md:p-8 rounded-2xl md:rounded-3xl border-2 border-slate-800 hover:border-yellow-500 hover:bg-yellow-900/10 transition-all group flex flex-col items-center gap-2 md:gap-4 shadow-lg"
            >
              <span className="text-4xl md:text-6xl group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                👤
              </span>
              <span className="text-sm md:text-2xl font-bold text-white">
                Acesso do Aluno
              </span>
            </button>
            <button
              onClick={() => setView("login_teacher")}
              className="bg-slate-900 p-4 md:p-8 rounded-2xl md:rounded-3xl border-2 border-slate-800 hover:border-emerald-500 hover:bg-emerald-900/10 transition-all group flex flex-col items-center gap-2 md:gap-4 shadow-lg"
            >
              <span className="text-4xl md:text-6xl group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                🛡️
              </span>
              <span className="text-sm md:text-2xl font-bold text-white">
                Área do Professor
              </span>
            </button>
          </div>
        </div>
      )}

      {/* TELA DE LOGIN - ALUNO */}
      {view === "login_student" && (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 p-6 md:p-8 rounded-3xl w-full max-w-md border-t-4 border-yellow-500 shadow-2xl relative">
            <button
              onClick={() => {
                setView("login_select");
                setAuthError("");
              }}
              className="absolute top-4 md:top-6 left-4 md:left-6 text-slate-500 hover:text-white text-xl md:text-2xl"
            >
              ⬅️
            </button>
            <div className="text-center mb-6 md:mb-8 mt-2 md:mt-4">
              <span className="text-4xl md:text-6xl mx-auto mb-2 block animate-pulse">
                👤
              </span>
              <h2 className="text-lg md:text-2xl font-bold text-white">
                Entrar na Aventura
              </h2>
            </div>
            {authError && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm text-center font-bold">
                {authError}
              </div>
            )}
            <form
              onSubmit={handleStudentLogin}
              className="space-y-3 md:space-y-4"
            >
              <input
                type="text"
                required
                className="w-full p-3 md:p-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-yellow-500 outline-none text-sm md:text-base"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    username: e.target.value.toLowerCase(),
                  })
                }
                placeholder="Seu usuário (login)"
              />
              <input
                type="password"
                required
                className="w-full p-3 md:p-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-yellow-500 outline-none tracking-widest font-black text-sm md:text-base"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                placeholder="Sua senha"
              />
              <button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-yellow-950 font-black py-3.5 md:py-4 rounded-xl mt-4 transition-colors tracking-wider uppercase shadow-[0_4px_0_0_#ca8a04] hover:shadow-none hover:translate-y-1 text-sm md:text-base"
              >
                Carregar Missões
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TELA DE LOGIN - PROFESSOR */}
      {view === "login_teacher" && (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 p-6 md:p-8 rounded-3xl w-full max-w-md border-t-4 border-emerald-500 shadow-2xl relative">
            <button
              onClick={() => {
                setView("login_select");
                setAuthError("");
              }}
              className="absolute top-4 md:top-6 left-4 md:left-6 text-slate-500 hover:text-white text-xl md:text-2xl"
            >
              ⬅️
            </button>
            <div className="text-center mb-6 md:mb-8 mt-2 md:mt-4">
              <span className="text-4xl md:text-6xl mx-auto mb-2 block">
                🛡️
              </span>
              <h2 className="text-lg md:text-2xl font-bold text-white">
                Portal Docente
              </h2>
            </div>
            {authError && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm text-center font-bold">
                {authError}
              </div>
            )}
            <form
              onSubmit={handleTeacherLogin}
              className="space-y-3 md:space-y-4"
            >
              <input
                type="email"
                required
                className="w-full p-3 md:p-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none text-sm md:text-base"
                value={teacherAuth.email}
                onChange={(e) =>
                  setTeacherAuth({ ...teacherAuth, email: e.target.value })
                }
                placeholder="E-mail do professor"
              />
              <input
                type="password"
                required
                className="w-full p-3 md:p-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none tracking-widest font-black text-sm md:text-base"
                value={teacherAuth.password}
                onChange={(e) =>
                  setTeacherAuth({ ...teacherAuth, password: e.target.value })
                }
                placeholder="Senha"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 md:py-4 rounded-xl mt-4 transition-colors tracking-wider uppercase shadow-[0_4px_0_0_#064e3b] hover:shadow-none hover:translate-y-1 text-sm md:text-base"
              >
                Acessar Painel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DASHBOARD DO ALUNO */}
      {view === "student_dash" && loggedInStudent && (
        <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 font-sans relative">
          {/* HEADER FIXO PARA MOBILE (MENÚ HAMBÚRGUER) E DESKTOP (LADO A LADO) */}
          <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-2xl pb-1 md:pb-0">
            <div className="max-w-7xl mx-auto p-2 md:p-6">
              <div className="flex flex-col mb-1.5 md:mb-4">
                {/* Topo Mobile (Sempre Visível) */}
                <div className="flex justify-between items-center w-full md:hidden mb-2">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-lg flex items-center justify-center shadow-inner border border-slate-700 transition-colors"
                  >
                    <span className="text-xl leading-none">⋮</span>{" "}
                    <span className="text-[10px] font-black uppercase ml-1.5 tracking-widest">
                      {isMobileMenuOpen ? "Fechar" : "Menu"}
                    </span>
                  </button>
                  <div className="flex gap-1.5">
                    <button
                      onClick={toggleMusic}
                      className={`border px-2.5 py-1.5 rounded-lg transition-colors font-bold text-xs shadow-sm ${
                        isMusicPlaying
                          ? "bg-blue-900/50 border-blue-500 text-blue-400"
                          : "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300"
                      }`}
                      title="Alternar Música"
                    >
                      {isMusicPlaying ? "🔊" : "🔇"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-slate-800 hover:bg-red-900/50 hover:text-red-400 text-slate-400 px-2.5 py-1.5 rounded-lg transition-colors font-bold text-xs border border-slate-700"
                    >
                      🚪
                    </button>
                  </div>
                </div>

                {/* Conteúdo do Menu (Colapsável no Mobile, Fixo no Desktop) */}
                <div
                  className={`${
                    isMobileMenuOpen ? "flex" : "hidden"
                  } md:flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 bg-slate-950/50 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none border md:border-none border-slate-800/50 mb-2 md:mb-0`}
                >
                  {/* Avatar e Nome */}
                  <div className="flex justify-between items-center w-full md:w-auto">
                    <div className="flex items-center gap-3 md:gap-4 w-full">
                      <div>
                        <PlayerCard
                          student={safeStudent}
                          size="sm"
                          disableHover={true}
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-black text-lg md:text-2xl text-white leading-none">
                          {(safeStudent.name || "Aluno").split(" ")[0]}
                        </h2>
                        <p className="hidden sm:block text-slate-400 font-bold text-sm mt-1">
                          Pronto para a missão?
                        </p>
                        <div className="sm:hidden mt-1.5 inline-flex items-center gap-1 bg-black/50 border border-slate-700 px-2 py-1 rounded-lg text-[9px] font-bold text-slate-300 shadow-inner">
                          {studentLevelInfo.currentLevel.icon} Nvl.{" "}
                          {studentLevelInfo.currentLevel.id}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status e Botões Desktop */}
                  <div className="flex flex-row items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-none border-slate-800">
                    <div className="flex w-full md:w-auto gap-1.5 md:gap-3 justify-between">
                      <div className="flex-1 md:flex-none bg-slate-950 border border-slate-800 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl flex flex-col items-center justify-center min-w-[70px]">
                        <span className="text-[8px] md:text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                          Aura XP
                        </span>
                        <span className="text-sm md:text-xl font-black text-white flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>{" "}
                          {safeStudent.xp || 0}
                        </span>
                      </div>
                      <div className="flex-1 md:flex-none bg-yellow-500/10 border border-yellow-500/30 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl flex flex-col items-center justify-center min-w-[70px]">
                        <span className="text-[8px] md:text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                          Moedas
                        </span>
                        <span className="text-sm md:text-xl font-black text-yellow-400 flex items-center gap-1">
                          <span className="text-yellow-400">🪙</span>{" "}
                          {safeStudent.coins || 0}
                        </span>
                      </div>
                      <div className="flex-1 md:flex-none bg-orange-500/10 border border-orange-500/30 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl flex flex-col items-center justify-center min-w-[70px]">
                        <span className="text-[8px] md:text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                          Fogo
                        </span>
                        <span className="text-sm md:text-xl font-black text-orange-400 flex items-center gap-1">
                          <span className="text-orange-400">
                            {getStreakIcon(streakInfo.currentStreak)}
                          </span>{" "}
                          {streakInfo.currentStreak} d
                        </span>
                      </div>
                    </div>
                    {/* Botões Desktop (Só aparecem se a tela for grande) */}
                    <div className="hidden md:flex gap-3">
                      <button
                        onClick={toggleMusic}
                        className={`border px-3 py-2 rounded-xl transition-colors font-bold text-lg shadow-sm ${
                          isMusicPlaying
                            ? "bg-blue-900/50 border-blue-500 text-blue-400"
                            : "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300"
                        }`}
                        title="Alternar Música"
                      >
                        {isMusicPlaying ? "🔊" : "🔇"}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="bg-slate-800 hover:bg-red-900/50 hover:text-red-400 text-slate-400 px-3 py-2 rounded-xl transition-colors font-bold text-lg border border-slate-700"
                      >
                        🚪
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* LINHA 3: Barra de Nível Fina e Elegante */}
              <div className="bg-slate-950 p-1 rounded-full border border-slate-800 mb-1.5 md:mb-6">
                <div className="h-1 md:h-3 w-full bg-slate-900 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-600 to-orange-400 transition-all duration-1000 relative"
                    style={{ width: `${studentLevelInfo.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between px-2 mt-0.5 md:mt-2 text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>
                    {studentLevelInfo.currentLevel.icon}{" "}
                    {studentLevelInfo.currentLevel.title}
                  </span>
                  <span>
                    {isMaxLevel
                      ? "🏆 Parabéns! Você farmou aura!"
                      : `Meta: ${studentLevelInfo.nextLevel.title} (${studentLevelInfo.nextLevel.minXp} XP)`}
                  </span>
                </div>
              </div>

              {/* LINHA 4: Navegação Base */}
              <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 scrollbar-hide w-full">
                <button
                  onClick={() => setStudentTab("missions")}
                  className={`px-2.5 md:px-5 py-1.5 md:py-3 rounded-lg md:rounded-xl font-black text-[9px] md:text-sm uppercase tracking-wider flex justify-center items-center gap-1.5 transition-colors whitespace-nowrap ${
                    studentTab === "missions"
                      ? "bg-yellow-500 text-yellow-950 shadow-md"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  <span className="text-xs md:text-lg">🎯</span> Missões
                </button>
                <button
                  onClick={() => {
                    setStudentTab("store");
                    clearPreview();
                  }}
                  className={`px-2.5 md:px-5 py-1.5 md:py-3 rounded-lg md:rounded-xl font-black text-[9px] md:text-sm uppercase tracking-wider flex justify-center items-center gap-1.5 transition-colors whitespace-nowrap ${
                    studentTab === "store"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  <span className="text-xs md:text-lg">🛍️</span> Loja
                </button>
                <button
                  onClick={() => setStudentTab("fichario")}
                  className={`px-2.5 md:px-5 py-1.5 md:py-3 rounded-lg md:rounded-xl font-black text-[9px] md:text-sm uppercase tracking-wider flex justify-center items-center gap-1.5 transition-colors whitespace-nowrap ${
                    studentTab === "fichario"
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  <span className="text-xs md:text-lg">🎒</span> Fichário
                </button>
                <button
                  onClick={() => setStudentTab("profile")}
                  className={`px-2.5 md:px-5 py-1.5 md:py-3 rounded-lg md:rounded-xl font-black text-[9px] md:text-sm uppercase tracking-wider flex justify-center items-center gap-1.5 transition-colors whitespace-nowrap ${
                    studentTab === "profile"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  <span className="text-xs md:text-lg">🏅</span> Conquistas
                </button>
                <button
                  onClick={() => setStudentTab("ranking")}
                  className={`px-2.5 md:px-5 py-1.5 md:py-3 rounded-lg md:rounded-xl font-black text-[9px] md:text-sm uppercase tracking-wider flex justify-center items-center gap-1.5 transition-colors whitespace-nowrap ${
                    studentTab === "ranking"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  <span className="text-xs md:text-lg">🏆</span> Ranking
                </button>
              </div>
            </div>
          </div>

          {/* ÁREA DE CONTEÚDO PRINCIPAL (Missions, Store, etc) */}
          <div className="max-w-7xl mx-auto p-2 md:p-6 mt-1 md:mt-2 relative">
            {studentTab === "missions" && (
              <div className="max-w-3xl mx-auto space-y-3 md:space-y-5">
                {availableMissions.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-12 text-center shadow-inner">
                    <div className="text-5xl md:text-7xl mb-4 md:mb-6">🏆</div>
                    <h3 className="text-xl md:text-3xl font-black text-white mb-2 md:mb-3">
                      Missões Cumpridas!
                    </h3>
                    <p className="text-slate-400 text-sm md:text-lg">
                      Você completou todas as missões atuais.
                    </p>
                  </div>
                ) : (
                  availableMissions.map((mission) => (
                    <div
                      key={mission.id}
                      onClick={() => {
                        setActiveMission(mission);
                        setMissionAttempts(0);
                        setView("student_mission");
                      }}
                      className="bg-slate-900 border border-slate-800 hover:border-yellow-500 rounded-2xl md:rounded-3xl p-3 md:p-6 flex gap-3 md:gap-5 cursor-pointer transition-all group hover:-translate-y-1 relative overflow-hidden shadow-lg hover:shadow-yellow-900/20"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-colors animate-pulse"></div>
                      <div
                        className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br ${mission.color} flex items-center justify-center text-3xl md:text-4xl shrink-0 shadow-lg relative z-10`}
                      >
                        {mission.icon}
                      </div>
                      <div className="flex-1 relative z-10 flex flex-col justify-center">
                        <div className="flex items-start justify-between mb-1 md:mb-2">
                          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-950 px-2 py-0.5 md:py-1 rounded-full border border-slate-800">
                            {mission.subject} •{" "}
                            {mission.format === "objective"
                              ? "Objetiva"
                              : "Escrita"}
                          </span>
                          {mission.targetType === "specific" && (
                            <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 px-1.5 md:px-2 py-0.5 rounded border border-emerald-800">
                              Missão Secreta 🕵️
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-sm md:text-xl text-white leading-tight mb-2 md:mb-3 group-hover:text-yellow-400 transition-colors">
                          {mission.title}
                        </h4>
                        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-auto">
                          <span className="flex items-center gap-1 md:gap-1.5 text-[9px] md:text-xs font-black text-yellow-300 bg-yellow-900/30 px-2 md:px-2.5 py-0.5 md:py-1.5 rounded-md md:rounded-lg border border-yellow-500/30">
                            ⭐ +{mission.xp} XP
                          </span>
                          <span className="flex items-center gap-1 md:gap-1.5 text-[9px] md:text-xs font-black text-yellow-400 bg-yellow-900/30 px-2 md:px-2.5 py-0.5 md:py-1.5 rounded-md md:rounded-lg border border-yellow-500/30">
                            🪙 +{mission.coins} Moedas
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {studentTab === "store" && (
              <div className="flex flex-col gap-3 md:gap-6 relative">
                {/* Abas de Categoria no Topo da Loja AGORA PEGAJOSAS (Sticky) */}
                <div className="sticky top-[120px] sm:top-[140px] md:top-[160px] lg:top-[160px] z-20 bg-slate-950 pt-2 pb-1 shadow-md flex gap-2 overflow-x-auto scrollbar-hide border-b border-slate-800 mb-1 md:mb-2 w-full">
                  {["Ícones", "Molduras", "Títulos", "Fundos"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setStoreCategory(cat)}
                      className={`px-3 md:px-6 py-1.5 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-1.5 md:gap-2 ${
                        storeCategory === cat
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Container Responsivo: Mobile (Topo) / Desktop (Direita Fixo) */}
                <div className="flex flex-col lg:flex-row gap-4 md:gap-8 items-start relative">
                  {/* Provador Limpo - Mobile: Fica no Topo / Desktop: Segue na lateral direita com margem segura */}
                  <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 self-start z-10 pt-1 md:pt-2 order-1 lg:order-2 lg:sticky lg:top-[340px]">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl md:rounded-3xl p-3 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

                      {/* Cabeçalho do Provador Otimizado */}
                      <div className="w-full text-center relative z-10 border-b border-slate-800 pb-2 md:pb-4">
                        <h3 className="text-white font-black text-sm md:text-lg uppercase tracking-wider flex items-center justify-center gap-1.5 md:gap-2">
                          <span>🪞</span> Provador Virtual
                        </h3>
                        <p className="text-slate-400 font-bold text-[8px] md:text-[10px] uppercase tracking-widest mt-1 md:mt-2 leading-relaxed">
                          Clique em "Testar Visual" para exibir a peça no
                          manequim abaixo.
                        </p>
                      </div>

                      {/* Manequim 100% Oco e Responsivo */}
                      <div className="relative z-10 w-full flex justify-center mt-1 md:mt-2 mb-1 md:mb-2 transform scale-75 sm:scale-100 origin-top">
                        {Object.keys(previewEquipped).length === 0 ? (
                          <div className="w-28 sm:w-44 min-h-[7rem] sm:min-h-[11rem] border-[2px] md:border-[3px] border-dashed border-slate-700/50 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center bg-transparent relative overflow-hidden"></div>
                        ) : (
                          <PlayerCard
                            student={safeStudent}
                            customEquipped={previewEquipped}
                            isEmptyMannequin={false}
                            size="md"
                            disableHover={true}
                          />
                        )}
                      </div>

                      {/* Botão de Limpar Oculto se Vazio */}
                      {Object.keys(previewEquipped).length > 0 && (
                        <button
                          onClick={clearPreview}
                          className="relative z-10 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-black uppercase tracking-wider text-[9px] md:text-xs px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl transition-colors shadow-inner mt-1 md:mt-2"
                        >
                          🧹 Limpar Manequim
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Vitrine de Itens */}
                  <div className="flex-1 w-full order-2 lg:order-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
                      {STORE_ITEMS.filter(
                        (i) => i.category === storeCategory
                      ).map((item) => {
                        const isOwned = (safeStudent.inventory || []).includes(
                          item.id
                        );
                        const isPreviewing =
                          previewEquipped[item.slot] === item.id;
                        const isLocked =
                          studentLevelInfo.currentLevel.id <
                          (item.minLevel || 1);
                        const levelReq = LEVELS.find(
                          (l) => l.id === item.minLevel
                        );

                        return (
                          <div
                            key={item.id}
                            className={`bg-slate-900 border ${
                              isPreviewing
                                ? "border-blue-500 bg-blue-900/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                : "border-slate-800"
                            } rounded-2xl md:rounded-3xl p-3 md:p-5 text-center flex flex-col items-center relative transition-all ${
                              isLocked
                                ? "opacity-60 grayscale"
                                : !isOwned &&
                                  (safeStudent.coins || 0) < item.price
                                ? "opacity-80"
                                : "hover:-translate-y-1 hover:border-slate-600"
                            }`}
                          >
                            <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3">
                              {getRarityBadge(item.rarity)}
                            </div>
                            <div className="text-3xl md:text-5xl mt-6 md:mt-10 mb-2 md:mb-4 drop-shadow-xl">
                              {item.icon}
                            </div>
                            <h4
                              className={`font-black text-[9px] md:text-sm mb-2 leading-tight min-h-[1.5rem] md:min-h-[2.5rem] flex items-center justify-center ${
                                item.color || "text-white"
                              }`}
                            >
                              {item.name}
                            </h4>

                            <div className="mt-auto w-full pt-2 md:pt-4 border-t border-slate-800/50 flex flex-col gap-1.5 md:gap-2">
                              <button
                                onClick={() => {
                                  handlePreviewItem(item);
                                  if (window.innerWidth < 1024)
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    });
                                }}
                                className={`w-full py-1.5 md:py-2 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-wider transition-colors ${
                                  isPreviewing
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-800 text-slate-300 hover:bg-blue-500 hover:text-white"
                                }`}
                              >
                                🔍 Testar Visual
                              </button>

                              {isLocked ? (
                                <button
                                  disabled
                                  className="w-full py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-wider flex flex-col justify-center items-center gap-0.5 bg-slate-950 text-red-500 border border-red-900 cursor-not-allowed leading-none"
                                >
                                  <span>🔒 BLOQUEADO</span>
                                  <span className="text-[7px] md:text-[8px] font-bold text-red-400 mt-0.5">
                                    Requer {levelReq?.minXp} XP
                                  </span>
                                </button>
                              ) : !isOwned ? (
                                <button
                                  onClick={() => buyItem(item)}
                                  className={`w-full py-2 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase tracking-wider flex justify-center items-center gap-1.5 transition-colors ${
                                    (safeStudent.coins || 0) >= item.price
                                      ? "bg-yellow-500 hover:bg-yellow-400 text-yellow-950 shadow-md"
                                      : "bg-slate-950 text-slate-600 cursor-not-allowed border border-slate-900"
                                  }`}
                                >
                                  🪙 {item.price}
                                </button>
                              ) : (
                                <div className="w-full py-2 md:py-3 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-wider bg-slate-800 text-emerald-400 border border-slate-700">
                                  ✔️ Na Mochila
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {studentTab === "fichario" && (
              <div className="flex flex-col gap-3 md:gap-6">
                <div className="flex gap-2 mb-1 md:mb-2 overflow-x-auto pb-1 md:pb-2 scrollbar-hide border-b border-slate-800">
                  <button
                    onClick={() => setFicharioTab("equip")}
                    className={`px-3 md:px-6 py-1.5 md:py-3 rounded-lg md:rounded-xl font-black text-[9px] md:text-xs uppercase tracking-wider transition-colors whitespace-nowrap ${
                      ficharioTab === "equip"
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    🎒 Montar Visual
                  </button>
                  <button
                    onClick={() => setFicharioTab("decks")}
                    className={`px-3 md:px-6 py-1.5 md:py-3 rounded-lg md:rounded-xl font-black text-[9px] md:text-xs uppercase tracking-wider transition-colors whitespace-nowrap ${
                      ficharioTab === "decks"
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    Cards Salvos ({(safeStudent.decks || []).length})
                  </button>
                  <button
                    onClick={() => setFicharioTab("gifts")}
                    className={`px-3 md:px-6 py-1.5 md:py-3 rounded-lg md:rounded-xl font-black text-[9px] md:text-xs uppercase tracking-wider transition-colors whitespace-nowrap ${
                      ficharioTab === "gifts"
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    Presentes ({(safeStudent.gifts || []).length})
                  </button>
                </div>

                {ficharioTab === "equip" && (
                  <div className="flex flex-col lg:flex-row gap-4 md:gap-8 items-start relative">
                    {/* Card Atual Lado a Lado / Mobile no Topo - Segue Margem Segura */}
                    <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-6 xl:p-8 flex flex-col items-center justify-center relative overflow-hidden lg:sticky lg:top-[340px] self-start shadow-xl z-10 order-1">
                      <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                      <h3 className="text-white font-black text-base md:text-xl xl:text-2xl mb-2 md:mb-4 text-center relative z-10 w-full border-b border-slate-800 pb-2 md:pb-4">
                        Seu Card Atual
                      </h3>

                      <div className="mb-3 md:mb-6 relative z-10 w-full flex justify-center mt-1 md:mt-2 transform scale-90 sm:scale-100 origin-top">
                        <PlayerCard
                          student={safeStudent}
                          size="xl"
                          disableHover={true}
                        />
                      </div>

                      <div className="w-full relative z-10">
                        <button
                          onClick={saveDeck}
                          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-2.5 md:py-4 xl:py-5 rounded-xl transition-all shadow-[0_4px_0_0_#581c87] hover:shadow-none hover:translate-y-1 uppercase tracking-wider flex justify-center items-center gap-1.5 md:gap-2 text-[10px] md:text-sm xl:text-base"
                        >
                          <span>💾</span> Salvar na Coleção
                        </button>
                      </div>
                    </div>

                    {/* Inventário / Mochila */}
                    <div className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-xl order-2">
                      <h3 className="text-white font-black text-sm md:text-xl mb-1 md:mb-2 flex items-center gap-1.5 md:gap-2">
                        <span>🎒</span> Sua Mochila
                      </h3>
                      <p className="text-slate-400 font-bold text-[8px] md:text-xs mb-2 md:mb-6 border-b border-slate-800 pb-2 md:pb-4">
                        Clique nas peças compradas para vesti-las.
                      </p>

                      <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2 md:pb-4 scrollbar-hide mb-2 md:mb-4">
                        {["Ícones", "Molduras", "Títulos", "Fundos"].map(
                          (cat) => (
                            <button
                              key={cat}
                              onClick={() => setFicharioCategory(cat)}
                              className={`px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                                ficharioCategory === cat
                                  ? "bg-purple-600 text-white shadow-md"
                                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800"
                              }`}
                            >
                              {cat}
                            </button>
                          )
                        )}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-4 gap-2 md:gap-4">
                        {STORE_ITEMS.filter(
                          (i) =>
                            i.category === ficharioCategory &&
                            (safeStudent.inventory || []).includes(i.id)
                        ).map((item) => {
                          const isEquipped =
                            (safeStudent.equipped || {})[item.slot] === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => equipItem(item)}
                              className={`cursor-pointer bg-slate-950 border-2 rounded-xl md:rounded-2xl p-2 md:p-4 text-center flex flex-col items-center justify-center transition-all relative hover:-translate-y-1 ${
                                isEquipped
                                  ? "border-purple-500 bg-purple-900/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                                  : "border-slate-800 hover:border-slate-600"
                              }`}
                            >
                              {isEquipped && (
                                <span className="absolute top-1 md:top-2 right-1 md:right-2 text-purple-400 text-[8px] md:text-xs bg-purple-950 rounded-full w-4 h-4 md:w-6 md:h-6 flex items-center justify-center border border-purple-500 shadow-sm">
                                  ✔️
                                </span>
                              )}
                              <div className="text-2xl md:text-5xl mb-1 md:mb-3 mt-1 md:mt-2 drop-shadow-lg">
                                {item.icon}
                              </div>
                              <span className="text-[7px] md:text-[10px] font-black text-slate-300 leading-tight uppercase tracking-widest truncate w-full">
                                {item.name}
                              </span>
                            </div>
                          );
                        })}
                        {STORE_ITEMS.filter(
                          (i) =>
                            i.category === ficharioCategory &&
                            (safeStudent.inventory || []).includes(i.id)
                        ).length === 0 && (
                          <div className="col-span-full py-8 md:py-12 text-center bg-slate-950 rounded-xl md:rounded-2xl border-2 border-slate-800 border-dashed">
                            <span className="text-3xl md:text-5xl block mb-2 md:mb-4 opacity-40">
                              🛍️
                            </span>
                            <p className="text-slate-400 font-bold text-[10px] md:text-sm">
                              Mochila vazia nesta categoria.
                            </p>
                            <button
                              onClick={() => setStudentTab("store")}
                              className="mt-2 md:mt-4 text-[9px] md:text-xs font-black bg-slate-800 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-purple-400 uppercase tracking-widest hover:text-white transition-colors"
                            >
                              Ir para Loja ➔
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {ficharioTab === "decks" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {(safeStudent.decks || []).length === 0 && (
                      <div className="col-span-full text-center p-6 md:p-12 bg-slate-900 rounded-2xl md:rounded-3xl border border-slate-800">
                        <span className="text-4xl md:text-5xl mb-2 md:mb-4 block">
                          📭
                        </span>
                        <p className="text-slate-400 font-bold text-xs md:text-base">
                          Nenhum card salvo na sua coleção ainda.
                        </p>
                      </div>
                    )}
                    {(safeStudent.decks || []).map((deck, idx) => (
                      <div
                        key={deck.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col items-center gap-3 md:gap-4 relative group hover:border-purple-500 transition-colors shadow-lg"
                      >
                        <button
                          onClick={() => deleteDeck(deck.id)}
                          className="absolute top-2 right-2 text-slate-500 hover:text-red-500 bg-slate-950 p-1.5 md:p-2 rounded-lg md:opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                          <span>🗑️</span>
                        </button>
                        <span className="text-[8px] md:text-[10px] font-black text-purple-400 uppercase tracking-widest absolute top-3 md:top-4 left-3 md:left-4 bg-purple-900/30 px-1.5 md:px-2 py-0.5 md:py-1 rounded border border-purple-500/30">
                          Card #{idx + 1}
                        </span>
                        <div className="mt-5 md:mt-4 w-full flex justify-center">
                          <PlayerCard
                            student={safeStudent}
                            customEquipped={deck.equipped}
                            size="lg"
                            disableHover={true}
                          />
                        </div>
                        <div className="w-full flex gap-1.5 md:gap-2 mt-1 md:mt-2">
                          <button
                            onClick={() => equipDeck(deck.equipped)}
                            className="flex-1 bg-slate-800 hover:bg-blue-600 text-white text-[9px] md:text-xs font-black uppercase tracking-wider py-2 md:py-3 rounded-xl transition-colors"
                          >
                            Usar Visual
                          </button>
                          <button
                            onClick={() => {
                              const recs = students.filter(
                                (s) => s.id !== safeStudent.id
                              );
                              if (recs.length === 0)
                                return showMsg(
                                  "Sem Amigos",
                                  "Não há outros alunos matriculados para enviar."
                                );

                              const modalHtml = (
                                <div className="text-left mt-2 md:mt-4 max-h-40 md:max-h-60 overflow-y-auto bg-slate-950 rounded-xl p-1.5 md:p-2 border border-slate-800">
                                  {recs.map((r) => (
                                    <button
                                      key={r.id}
                                      onClick={() => {
                                        sendGift(r.id, deck.equipped);
                                        setModal({ isOpen: false });
                                      }}
                                      className="w-full text-left p-2 md:p-3 hover:bg-slate-800 rounded-lg text-slate-300 font-bold text-[10px] md:text-sm mb-1 uppercase"
                                    >
                                      {(r.name || "Aluno").split(" ")[0]}
                                    </button>
                                  ))}
                                </div>
                              );
                              setModal({
                                isOpen: true,
                                title: "🎁 Enviar Presente",
                                message: modalHtml,
                                type: "info",
                                onConfirm: null,
                              });
                            }}
                            className="bg-slate-800 hover:bg-purple-600 text-white text-[9px] md:text-xs font-black uppercase tracking-wider px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors"
                            title="Enviar para Amigo"
                          >
                            🎁
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {ficharioTab === "gifts" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {(safeStudent.gifts || []).length === 0 && (
                      <div className="col-span-full text-center p-6 md:p-12 bg-slate-900 rounded-2xl md:rounded-3xl border border-slate-800">
                        <span className="text-4xl md:text-5xl mb-2 md:mb-4 block">
                          🎁
                        </span>
                        <p className="text-slate-400 font-bold text-xs md:text-base">
                          Você não recebeu presentes recentemente.
                        </p>
                      </div>
                    )}
                    {(safeStudent.gifts || []).map((gift) => (
                      <div
                        key={gift.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col items-center gap-3 md:gap-4 relative shadow-lg"
                      >
                        <span className="text-xs md:text-sm font-black text-white absolute top-2 md:top-3 left-2 md:left-3 bg-pink-600 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border-2 border-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.6)] z-30 flex items-center gap-1">
                          <span>🎁</span> De:{" "}
                          {(gift.fromName || "Colega").split(" ")[0]}
                        </span>
                        <div className="mt-8 w-full flex justify-center">
                          <PlayerCard
                            student={safeStudent}
                            customEquipped={gift.equipped}
                            size="lg"
                            disableHover={true}
                          />
                        </div>
                        <button
                          onClick={() => equipDeck(gift.equipped)}
                          className="w-full bg-slate-800 hover:bg-blue-600 text-white text-[9px] md:text-xs font-black uppercase tracking-wider py-2 md:py-3 rounded-xl transition-colors mt-1"
                        >
                          Usar Visual
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {studentTab === "profile" && (
              <div className="flex flex-col gap-3 md:gap-6 max-w-5xl mx-auto">
                {/* Destaques (Agora com a mensagem de Level Máximo do "Você farmou aura") */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-3 md:p-6 relative overflow-hidden flex flex-col items-center text-center shadow-lg">
                    <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
                    <span className="text-2xl md:text-4xl mb-1 md:mb-2 relative z-10">
                      ⭐
                    </span>
                    <h4 className="text-[8px] md:text-[10px] font-black text-yellow-500 uppercase tracking-widest relative z-10 mb-0.5 md:mb-1">
                      Próxima Meta
                    </h4>
                    {isMaxLevel ? (
                      <p className="text-white text-[10px] md:text-sm font-black relative z-10 mt-1">
                        🏆 Parabéns! Você farmou aura!
                      </p>
                    ) : (
                      <p className="text-slate-300 text-[10px] md:text-sm font-medium relative z-10">
                        Faltam{" "}
                        <span className="text-white font-black">
                          {studentLevelInfo.nextLevel.minXp -
                            (safeStudent.xp || 0)}{" "}
                          XP
                        </span>{" "}
                        para{" "}
                        <span className="text-yellow-400 font-bold">
                          {studentLevelInfo.nextLevel.title}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-3 md:p-6 relative overflow-hidden flex flex-col items-center text-center shadow-lg">
                    <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                    <span className="text-2xl md:text-4xl mb-1 md:mb-2 relative z-10">
                      🔥
                    </span>
                    <h4 className="text-[8px] md:text-[10px] font-black text-orange-500 uppercase tracking-widest relative z-10 mb-0.5 md:mb-1">
                      Melhor Sequência
                    </h4>
                    <p className="text-slate-300 text-[10px] md:text-sm font-medium relative z-10">
                      <span className="text-white font-black">
                        {streakInfo.bestStreak} Dias
                      </span>{" "}
                      seguidos.
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-3 md:p-6 relative overflow-hidden flex flex-col items-center text-center shadow-lg">
                    <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <span className="text-2xl md:text-4xl mb-1 md:mb-2 relative z-10">
                      🏅
                    </span>
                    <h4 className="text-[8px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest relative z-10 mb-0.5 md:mb-1">
                      Última Conquista
                    </h4>
                    <p className="text-slate-300 text-[10px] md:text-sm font-medium relative z-10">
                      {lastUnlocked ? (
                        <span className="text-white font-black">
                          {lastUnlocked.icon} {lastUnlocked.title}
                        </span>
                      ) : (
                        "Continue jogando!"
                      )}
                    </p>
                  </div>
                </div>

                {/* Meu Progresso */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg">
                  <h3 className="text-sm md:text-xl font-black text-white mb-3 md:mb-6 flex items-center gap-1.5 md:gap-2">
                    <span className="text-purple-500">📊</span> Meu Progresso
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4">
                    <div className="bg-slate-950 p-2 md:p-4 rounded-xl md:rounded-2xl border border-slate-800 text-center">
                      <span className="text-lg md:text-2xl block mb-1">🎯</span>
                      <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 md:mb-1">
                        Missões
                      </p>
                      <p className="text-base md:text-xl font-black text-white">
                        {totalSubmissions}
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2 md:p-4 rounded-xl md:rounded-2xl border border-slate-800 text-center">
                      <span className="text-lg md:text-2xl block mb-1">⭐</span>
                      <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 md:mb-1">
                        XP Total
                      </p>
                      <p className="text-base md:text-xl font-black text-yellow-400">
                        {safeStudent.xp || 0}
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2 md:p-4 rounded-xl md:rounded-2xl border border-slate-800 text-center">
                      <span className="text-lg md:text-2xl block mb-1">🎁</span>
                      <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 md:mb-1">
                        Presentes
                      </p>
                      <p className="text-base md:text-xl font-black text-pink-400">
                        {(safeStudent.gifts || []).length}
                      </p>
                    </div>
                    <div className="bg-slate-950 p-2 md:p-4 rounded-xl md:rounded-2xl border border-slate-800 text-center">
                      <span className="text-lg md:text-2xl block mb-1">🃏</span>
                      <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 md:mb-1">
                        Cards Salvos
                      </p>
                      <p className="text-base md:text-xl font-black text-purple-400">
                        {totalDecksSaved}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mural de Conquistas */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-6 gap-2">
                    <h3 className="text-sm md:text-xl font-black text-white flex items-center gap-1.5 md:gap-2">
                      <span className="text-emerald-500">🏆</span> Mural de
                      Conquistas
                    </h3>
                    <span className="text-[9px] md:text-xs font-black text-emerald-400 bg-emerald-900/30 px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg border border-emerald-500/30">
                      {unlockedCount} / {ACHIEVEMENTS.length} Desbloqueadas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                    {ACHIEVEMENTS.map((ach) => (
                      <div
                        key={ach.id}
                        className={`p-2.5 md:p-4 rounded-xl md:rounded-2xl border-2 flex items-start gap-2.5 md:gap-4 transition-all ${
                          ach.unlocked
                            ? "bg-slate-950 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                            : "bg-slate-950/50 border-slate-800 opacity-60 grayscale"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl shrink-0 ${
                            ach.unlocked
                              ? "bg-emerald-900/40 text-emerald-400"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {ach.icon}
                        </div>
                        <div>
                          <h4
                            className={`font-black text-[10px] md:text-sm mb-0.5 md:mb-1 ${
                              ach.unlocked
                                ? "text-emerald-400"
                                : "text-slate-400"
                            }`}
                          >
                            {ach.title}
                          </h4>
                          <p className="text-[8px] md:text-[10px] font-medium text-slate-500 leading-tight">
                            {ach.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {studentTab === "ranking" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-3 md:p-8 shadow-xl relative overflow-hidden max-w-4xl mx-auto">
                <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
                <h3 className="text-sm md:text-2xl font-black text-white mb-3 md:mb-6 flex items-center gap-1.5 md:gap-3 relative z-10">
                  <span className="text-xl md:text-4xl">🏆</span> Ranking Global
                </h3>

                {/* Abas Sub-Ranking */}
                <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2 md:pb-4 mb-3 md:mb-6 scrollbar-hide border-b border-slate-800 relative z-10">
                  <button
                    onClick={() => setRankingCategory("xp")}
                    className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                      rankingCategory === "xp"
                        ? "bg-yellow-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    🏆 XP
                  </button>
                  <button
                    onClick={() => setRankingCategory("streak")}
                    className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                      rankingCategory === "streak"
                        ? "bg-orange-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    🔥 Sequência
                  </button>
                  <button
                    onClick={() => setRankingCategory("missions")}
                    className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                      rankingCategory === "missions"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    📚 Missões
                  </button>
                  <button
                    onClick={() => setRankingCategory("gifts")}
                    className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                      rankingCategory === "gifts"
                        ? "bg-pink-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    🎁 Generosidade
                  </button>
                </div>

                <div className="space-y-2 md:space-y-4 relative z-10">
                  {sortedStudents.map((student, index) => {
                    const isMe = student.id === safeStudent.id;
                    const rankLevelInfo = getLevelInfo(student.xp || 0);
                    let rankTrophy = "";
                    if (index === 0) rankTrophy = "🥇";
                    else if (index === 1) rankTrophy = "🥈";
                    else if (index === 2) rankTrophy = "🥉";
                    else
                      rankTrophy = (
                        <span className="text-slate-500 font-black px-1 md:px-2 text-[10px] md:text-base">
                          {index + 1}º
                        </span>
                      );

                    return (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between p-2 md:p-5 rounded-xl md:rounded-2xl border-2 transition-transform ${
                          isMe
                            ? "bg-indigo-900/40 border-indigo-500 transform lg:scale-[1.02] shadow-lg"
                            : "bg-slate-950 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 md:gap-4">
                          <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-3xl shrink-0">
                            {rankTrophy}
                          </div>
                          <div>
                            <h4
                              className={`font-black ${
                                isMe ? "text-indigo-300" : "text-slate-200"
                              } text-xs md:text-lg leading-none mb-0.5 md:mb-1`}
                            >
                              {(student.name || "Aluno").split(" ")[0]}{" "}
                              {isMe && (
                                <span className="text-[8px] md:text-[10px] ml-1">
                                  (Você)
                                </span>
                              )}
                            </h4>
                            <span className="text-[7px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              {rankLevelInfo.currentLevel.icon}{" "}
                              {rankLevelInfo.currentLevel.title}
                            </span>
                          </div>
                        </div>
                        <div className="text-right pr-2 md:pr-0">
                          {rankingCategory === "xp" && (
                            <p className="font-black text-yellow-400 text-xs md:text-xl">
                              {student.xp || 0}{" "}
                              <span className="text-[7px] md:text-sm">XP</span>
                            </p>
                          )}
                          {rankingCategory === "streak" && (
                            <p className="font-black text-orange-400 text-xs md:text-xl">
                              {student.streakCount}{" "}
                              <span className="text-[7px] md:text-sm">
                                Dias
                              </span>
                            </p>
                          )}
                          {rankingCategory === "missions" && (
                            <p className="font-black text-blue-400 text-xs md:text-xl">
                              {student.missionsCount}{" "}
                              <span className="text-[7px] md:text-sm">
                                Missões
                              </span>
                            </p>
                          )}
                          {rankingCategory === "gifts" && (
                            <p className="font-black text-pink-400 text-xs md:text-xl">
                              {student.giftsSentCount}{" "}
                              <span className="text-[7px] md:text-sm">
                                Presentes
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TELA DE REALIZAÇÃO DA MISSÃO */}
      {view === "student_mission" && safeActiveMission && loggedInStudent && (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
          <div className="p-2 md:p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center sticky top-0 z-20 shadow-xl">
            <button
              onClick={() => {
                setView("student_dash");
                setStudentAnswer("");
                setStudentObjAnswer(null);
              }}
              className="text-slate-400 hover:text-white flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm font-bold bg-slate-800 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-colors"
            >
              <span>⬅️</span> Abortar
            </button>
            <div className="flex gap-1.5 md:gap-2 bg-slate-950 p-1 md:p-1.5 rounded-lg md:rounded-xl border border-slate-800">
              <span
                className={`flex items-center gap-1 md:gap-1.5 text-[9px] md:text-xs font-black px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg transition-colors ${
                  currentMultiplier < 1
                    ? "text-red-400 bg-red-900/30 border border-red-500 animate-pulse"
                    : "text-yellow-400 bg-yellow-500/10"
                }`}
              >
                ⭐ +{currentPotentialXp}
              </span>
              <span
                className={`flex items-center gap-1 md:gap-1.5 text-[9px] md:text-xs font-black px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg transition-colors ${
                  currentMultiplier < 1
                    ? "text-red-400 bg-red-900/30 border border-red-500 animate-pulse"
                    : "text-yellow-500 bg-yellow-500/10"
                }`}
              >
                🪙 +{currentPotentialCoins}
              </span>
            </div>
          </div>

          <div className="flex-1 p-3 md:p-5 max-w-3xl mx-auto w-full flex flex-col pb-12">
            <div className="text-center mb-4 md:mb-8 mt-3 md:mt-6">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-gradient-to-br ${safeActiveMission.color} text-3xl md:text-5xl mb-3 md:mb-6 shadow-2xl transform -rotate-3 border-4 border-slate-900`}
              >
                {safeActiveMission.icon}
              </div>
              <h1 className="text-xl md:text-4xl font-black text-white mb-2 md:mb-4 leading-tight px-2">
                {safeActiveMission.title}
              </h1>
              <div className="inline-flex items-center gap-2 bg-slate-900 py-1.5 md:py-2.5 px-3 md:px-6 rounded-full border border-slate-800 text-slate-300 font-bold text-[10px] md:text-sm shadow-inner">
                <span>📖</span> {safeActiveMission.bookReference}
              </div>
            </div>

            <div className="bg-slate-900 p-4 md:p-8 rounded-2xl md:rounded-[2rem] mb-4 md:mb-8 border-l-[3px] md:border-l-4 border-blue-500 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 md:w-40 h-24 md:h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
              <h3 className="text-[9px] md:text-xs font-black text-blue-400 uppercase tracking-widest mb-2 md:mb-4 flex items-center gap-1.5 md:gap-2">
                <span>☑️</span> O que fazer
              </h3>

              {/* Imagem de Ilustração para o Aluno (Se existir) */}
              {safeActiveMission.imageUrl && (
                <div className="relative z-10 w-full mb-4 md:mb-6 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-950 flex justify-center">
                  <img
                    src={safeActiveMission.imageUrl}
                    alt="Ilustração da Missão"
                    className="max-h-[250px] md:max-h-[400px] object-contain"
                  />
                </div>
              )}

              <p className="text-white text-sm md:text-xl leading-relaxed font-medium relative z-10">
                {safeActiveMission.prompt}
              </p>
            </div>

            {safeActiveMission.format === "open" ? (
              <div className="flex-1 flex flex-col mb-4 md:mb-8">
                <label className="text-[9px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 md:mb-3 ml-2 flex items-center gap-1.5 md:gap-2">
                  <span>✍️</span> Seu Relatório
                </label>
                <textarea
                  className="w-full flex-1 min-h-[160px] md:min-h-[250px] p-4 md:p-6 bg-slate-900 border-2 border-slate-800 rounded-2xl md:rounded-3xl focus:border-blue-500 outline-none text-white text-sm md:text-xl resize-none placeholder-slate-700 shadow-inner transition-colors leading-relaxed"
                  placeholder="Escreva os detalhes aqui..."
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                ></textarea>
              </div>
            ) : (
              <div className="flex-1 flex flex-col mb-4 md:mb-8 gap-2 md:gap-4">
                <label className="text-[9px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-2">
                  Escolha a resposta correta:
                </label>
                {(safeActiveMission.options || []).map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStudentObjAnswer(idx)}
                    className={`w-full p-3 md:p-6 rounded-xl md:rounded-2xl border-2 text-left font-bold text-sm md:text-xl transition-all flex items-center gap-2.5 md:gap-4 ${
                      studentObjAnswer === idx
                        ? "bg-blue-600/20 border-blue-500 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        studentObjAnswer === idx
                          ? "border-blue-400 bg-blue-50"
                          : "border-slate-600"
                      }`}
                    >
                      {studentObjAnswer === idx && (
                        <div className="w-1.5 h-1.5 md:w-3 md:h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={submitMission}
              disabled={
                (safeActiveMission.format === "open" &&
                  !studentAnswer.trim()) ||
                (safeActiveMission.format === "objective" &&
                  studentObjAnswer === null)
              }
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 disabled:text-slate-600 disabled:border disabled:border-slate-800 text-white font-black py-3.5 md:py-6 rounded-xl md:rounded-2xl transition-all text-base md:text-xl uppercase tracking-wider shadow-[0_4px_0_0_#1e3a8a] md:shadow-[0_8px_0_0_#1e3a8a] hover:shadow-[0_2px_0_0_#1e3a8a] hover:translate-y-1 disabled:shadow-none disabled:translate-y-0"
            >
              Confirmar e Enviar
            </button>
          </div>
        </div>
      )}

      {/* TELA DE SUCESSO - PÓS MISSÃO */}
      {view === "student_success" && loggedInStudent && (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 text-center relative overflow-y-auto">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent"></div>
          <div className="w-20 h-20 md:w-32 md:h-32 mt-6 md:mt-12 bg-blue-500 rounded-full flex items-center justify-center text-4xl md:text-6xl mb-3 md:mb-6 animate-[bounce_1s_ease-in-out_infinite] relative z-10 shadow-[0_0_60px_rgba(59,130,246,0.6)] border-4 border-white/20 mx-auto">
            ⭐
          </div>
          <h1 className="text-2xl md:text-5xl font-black text-white mb-1.5 md:mb-2 relative z-10 tracking-tight">
            RESPOSTA ACEITA!
          </h1>
          <p className="text-blue-300 mb-4 md:mb-8 relative z-10 text-sm md:text-lg font-medium max-w-md">
            Ótimo trabalho! A atividade foi registrada.
          </p>

          <div className="flex gap-2.5 md:gap-4 relative z-10 mb-5 md:mb-8 justify-center w-full px-2 md:px-4">
            <div className="flex-1 max-w-[140px] md:max-w-[160px] bg-slate-900/80 backdrop-blur-md px-3 py-2 md:px-6 md:py-4 rounded-xl md:rounded-3xl border border-yellow-500/50 shadow-2xl transform hover:scale-105 transition-transform">
              <p className="text-[8px] md:text-[10px] text-yellow-500 font-black uppercase tracking-widest mb-0.5 md:mb-1">
                XP Ganho
              </p>
              <p className="text-xl md:text-4xl font-black text-yellow-400">
                +{earnedRewards.xp}
              </p>
            </div>
            <div className="flex-1 max-w-[140px] md:max-w-[160px] bg-slate-900/80 backdrop-blur-md px-3 py-2 md:px-6 md:py-4 rounded-xl md:rounded-3xl border border-yellow-500/50 shadow-2xl transform hover:scale-105 transition-transform">
              <p className="text-[8px] md:text-[10px] text-yellow-500 font-black uppercase tracking-widest mb-0.5 md:mb-1">
                Moedas
              </p>
              <p className="text-xl md:text-4xl font-black text-yellow-400">
                +{earnedRewards.coins}
              </p>
            </div>
          </div>

          {lastCompletedMission?.format === "open" &&
            lastCompletedMission?.expectedAnswer && (
              <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 p-3 md:p-6 rounded-xl md:rounded-3xl text-left relative z-10 shadow-2xl mb-5 md:mb-8">
                <h3 className="text-emerald-400 font-black uppercase tracking-widest text-[9px] md:text-xs mb-1 md:mb-2 flex items-center gap-1.5 md:gap-2">
                  ✅ Gabarito
                </h3>
                <p className="text-slate-300 font-medium mb-3 md:mb-6 italic bg-slate-950 p-2.5 md:p-4 rounded-lg md:rounded-xl text-xs md:text-base">
                  "{lastCompletedMission.expectedAnswer}"
                </p>

                <h3 className="text-blue-400 font-black uppercase tracking-widest text-[9px] md:text-xs mb-1 md:mb-2 flex items-center gap-1.5 md:gap-2">
                  ✍️ Sua Resposta Registrada
                </h3>
                <p className="text-slate-400 font-medium bg-slate-950 p-2.5 md:p-4 rounded-lg md:rounded-xl text-xs md:text-base">
                  "{lastStudentAnswer}"
                </p>
              </div>
            )}

          <button
            onClick={() => setView("student_dash")}
            className="relative z-10 bg-blue-600 hover:bg-blue-500 text-white font-black py-3 md:py-4 px-6 md:px-12 rounded-xl md:rounded-2xl text-sm md:text-xl shadow-[0_4px_0_0_#1e3a8a] md:shadow-[0_6px_0_0_#1e3a8a] hover:shadow-none hover:translate-y-1 transition-all uppercase tracking-wider mb-6 md:mb-12"
          >
            Continuar Aventura
          </button>
        </div>
      )}

      {/* DASHBOARD DO PROFESSOR */}
      {view === "teacher_dash" && (
        <div className="min-h-screen bg-slate-100 font-sans">
          <div className="bg-emerald-900 text-white p-3 md:p-5 shadow-lg sticky top-0 z-30">
            <div className="max-w-7xl mx-auto flex flex-row justify-between items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="bg-emerald-800 p-2 md:p-3 rounded-lg md:rounded-xl">
                  <span className="text-xl md:text-2xl">🛡️</span>
                </div>
                <div>
                  <h1 className="font-black text-base md:text-2xl leading-none tracking-tight">
                    Aura XP Admin
                  </h1>
                  <span className="text-[7px] md:text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                    Painel Pedagógico
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500 text-red-100 font-bold px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-sm transition-colors border border-red-500/50 flex items-center gap-1.5 md:gap-2"
              >
                <span>🚪</span> <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-2 md:p-8">
            <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2 md:pb-4 mb-3 md:mb-6 scrollbar-hide">
              <button
                onClick={() => setTeacherTab("missions")}
                className={`px-4 md:px-8 py-2 md:py-3.5 rounded-lg md:rounded-xl font-black text-[10px] md:text-sm uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 md:gap-2 ${
                  teacherTab === "missions"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-white text-slate-500 hover:bg-slate-200 border border-slate-200"
                } `}
              >
                <span>⭐</span> Gestão de Missões
              </button>
              <button
                onClick={() => setTeacherTab("students")}
                className={`px-4 md:px-8 py-2 md:py-3.5 rounded-lg md:rounded-xl font-black text-[10px] md:text-sm uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 md:gap-2 ${
                  teacherTab === "students"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-white text-slate-500 hover:bg-slate-200 border border-slate-200"
                } `}
              >
                <span>👤</span> Turma e Alunos
              </button>
            </div>

            {teacherTab === "missions" && (
              <div className="grid lg:grid-cols-12 gap-4 md:gap-8">
                {/* Coluna do Formulário */}
                <div className="lg:col-span-5 bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] shadow-xl border border-slate-200 h-fit order-2 lg:order-1">
                  <h2 className="text-sm md:text-xl font-black text-slate-800 mb-3 md:mb-6 flex items-center gap-1.5 md:gap-2 border-b-2 border-slate-100 pb-2 md:pb-4">
                    <span className="text-emerald-500 text-lg md:text-2xl">
                      {editingMissionId ? "✏️" : "➕"}
                    </span>{" "}
                    {editingMissionId ? "Editar Atividade" : "Criar Atividade"}
                  </h2>
                  <form
                    onSubmit={handleAddMission}
                    className="space-y-3 md:space-y-5"
                  >
                    <div>
                      <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-1.5">
                        Título da Missão
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full p-2.5 md:p-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold text-slate-700 focus:border-emerald-500 outline-none"
                        value={newMission.title}
                        onChange={(e) =>
                          setNewMission({
                            ...newMission,
                            title: e.target.value,
                          })
                        }
                        placeholder="Ex: O Ciclo da Água"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      <div>
                        <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-1.5">
                          Componente
                        </label>
                        <select
                          className="w-full p-2.5 md:p-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold text-slate-700 focus:border-emerald-500 outline-none"
                          value={newMission.subject}
                          onChange={(e) =>
                            setNewMission({
                              ...newMission,
                              subject: e.target.value,
                            })
                          }
                        >
                          {[
                            "Língua Portuguesa",
                            "Matemática",
                            "Ciências",
                            "História",
                            "Geografia",
                            "Arte",
                          ].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-1.5">
                          Tipo de Missão
                        </label>
                        <select
                          className="w-full p-2.5 md:p-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold text-slate-700 focus:border-emerald-500 outline-none"
                          value={newMission.type || "normal"}
                          onChange={(e) =>
                            setNewMission({
                              ...newMission,
                              type: e.target.value,
                            })
                          }
                        >
                          <option value="normal">Normal</option>
                          <option value="especial">Evento Especial</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-2.5 md:p-4 rounded-xl border-2 border-emerald-100">
                      <label className="block text-[8px] md:text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1.5 md:mb-3">
                        Público-Alvo
                      </label>
                      <div className="flex gap-1.5 md:gap-2 mb-1.5 md:mb-3">
                        <button
                          type="button"
                          onClick={() =>
                            setNewMission({
                              ...newMission,
                              targetType: "all",
                              targetStudents: [],
                            })
                          }
                          className={`flex-1 py-1.5 md:py-2 rounded-md md:rounded-lg font-bold text-[9px] md:text-xs uppercase tracking-wider border-2 transition-colors ${
                            newMission.targetType === "all"
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "bg-white border-slate-300 text-slate-500"
                          }`}
                        >
                          Turma Toda
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setNewMission({
                              ...newMission,
                              targetType: "specific",
                            })
                          }
                          className={`flex-1 py-1.5 md:py-2 rounded-md md:rounded-lg font-bold text-[9px] md:text-xs uppercase tracking-wider border-2 transition-colors ${
                            newMission.targetType === "specific"
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "bg-white border-slate-300 text-slate-500"
                          }`}
                        >
                          Alunos Específicos
                        </button>
                      </div>

                      {newMission.targetType === "specific" && (
                        <div className="max-h-32 md:max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-lg md:rounded-xl p-1.5 md:p-2 space-y-1">
                          {students.map((s) => (
                            <label
                              key={s.id}
                              className="flex items-center gap-2 p-1.5 md:p-2 hover:bg-slate-50 rounded-md md:rounded-lg cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={newMission.targetStudents?.includes(
                                  s.id
                                )}
                                onChange={() => toggleTargetStudent(s.id)}
                                className="w-3 h-3 md:w-4 md:h-4 accent-indigo-600"
                              />
                              <span className="text-[9px] md:text-xs font-bold text-slate-700 uppercase">
                                {s.name}
                              </span>
                            </label>
                          ))}
                          {students.length === 0 && (
                            <p className="text-[8px] md:text-xs text-slate-400 text-center py-2">
                              Nenhum aluno cadastrado.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-yellow-50 p-3 md:p-5 rounded-xl border-2 border-yellow-200 shadow-sm relative overflow-hidden">
                      <h3 className="text-[8px] md:text-xs font-black text-yellow-800 uppercase tracking-widest mb-1.5 md:mb-3 flex items-center gap-1.5 md:gap-2">
                        ✨ Recompensas do Aluno
                      </h3>
                      <div className="grid grid-cols-2 gap-2 md:gap-4">
                        <div>
                          <label className="block text-[8px] md:text-[10px] font-black text-yellow-700 uppercase tracking-widest mb-1">
                            XP (Nível)
                          </label>
                          <input
                            type="number"
                            className="w-full p-2.5 md:p-3.5 bg-white border-2 border-yellow-300 rounded-lg md:rounded-xl text-sm md:text-lg font-black text-yellow-800 focus:border-yellow-500 outline-none"
                            value={newMission.xp}
                            onChange={(e) =>
                              setNewMission({
                                ...newMission,
                                xp: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] md:text-[10px] font-black text-yellow-700 uppercase tracking-widest mb-1">
                            Moedas (Loja)
                          </label>
                          <input
                            type="number"
                            className="w-full p-2.5 md:p-3.5 bg-white border-2 border-yellow-300 rounded-lg md:rounded-xl text-sm md:text-lg font-black text-yellow-800 focus:border-yellow-500 outline-none"
                            value={newMission.coins}
                            onChange={(e) =>
                              setNewMission({
                                ...newMission,
                                coins: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-1.5">
                        Referência Material
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full p-2.5 md:p-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold text-slate-700 focus:border-emerald-500 outline-none"
                        value={newMission.bookReference}
                        onChange={(e) =>
                          setNewMission({
                            ...newMission,
                            bookReference: e.target.value,
                          })
                        }
                        placeholder="Ex: Currículo em Ação - Pág 40"
                      />
                    </div>

                    {/* Novo Campo de Imagem (Professor) */}
                    <div>
                      <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-1.5">
                        URL da Imagem de Ilustração (Opcional)
                      </label>
                      <input
                        type="url"
                        className="w-full p-2.5 md:p-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold text-slate-700 focus:border-emerald-500 outline-none"
                        value={newMission.imageUrl || ""}
                        onChange={(e) =>
                          setNewMission({
                            ...newMission,
                            imageUrl: e.target.value,
                          })
                        }
                        placeholder="Cole o link de uma imagem (ex: https://...)"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-1.5">
                        Comando (O que fazer)
                      </label>
                      <textarea
                        required
                        className="w-full p-2.5 md:p-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-sm font-medium min-h-[60px] md:min-h-[100px] focus:border-emerald-500 outline-none resize-y"
                        value={newMission.prompt}
                        onChange={(e) =>
                          setNewMission({
                            ...newMission,
                            prompt: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>

                    <div className="bg-slate-100 p-2.5 md:p-4 rounded-xl border-2 border-slate-200">
                      <label className="block text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 md:mb-3">
                        Tipo de Resposta Esperada
                      </label>
                      <div className="flex gap-1.5 md:gap-2 mb-2 md:mb-4">
                        <button
                          type="button"
                          onClick={() =>
                            setNewMission({ ...newMission, format: "open" })
                          }
                          className={`flex-1 py-1.5 md:py-2 rounded-md md:rounded-lg font-bold text-[9px] md:text-xs uppercase tracking-wider border-2 transition-colors ${
                            newMission.format === "open"
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-slate-300 text-slate-500"
                          }`}
                        >
                          Dissertativa
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setNewMission({
                              ...newMission,
                              format: "objective",
                            })
                          }
                          className={`flex-1 py-1.5 md:py-2 rounded-md md:rounded-lg font-bold text-[9px] md:text-xs uppercase tracking-wider border-2 transition-colors ${
                            newMission.format === "objective"
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "bg-white border-slate-300 text-slate-500"
                          }`}
                        >
                          Objetiva
                        </button>
                      </div>
                      {newMission.format === "open" ? (
                        <div className="space-y-2 md:space-y-4">
                          <div>
                            <label className="block text-[8px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Palavras-Chave Obrigatórias
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 md:p-3 bg-white border border-slate-300 rounded-md md:rounded-lg text-[9px] md:text-xs font-mono text-slate-600 focus:border-emerald-500 outline-none"
                              value={newMission.keywords}
                              onChange={(e) =>
                                setNewMission({
                                  ...newMission,
                                  keywords: e.target.value,
                                })
                              }
                              placeholder="Ex: fotossíntese, sol (Separe por vírgula)"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Resposta Esperada (Gabarito)
                            </label>
                            <textarea
                              className="w-full p-2 md:p-3 bg-white border border-slate-300 rounded-md md:rounded-lg text-[9px] md:text-xs font-medium text-slate-600 focus:border-emerald-500 outline-none min-h-[50px] md:min-h-[80px]"
                              value={newMission.expectedAnswer}
                              onChange={(e) =>
                                setNewMission({
                                  ...newMission,
                                  expectedAnswer: e.target.value,
                                })
                              }
                              placeholder="Ex: O texto mostra que as plantas usam o sol para fazer fotossíntese..."
                            ></textarea>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 md:space-y-2">
                          <label className="block text-[8px] md:text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Opções de Resposta
                          </label>
                          {[1, 2, 3, 4].map((num) => (
                            <div
                              key={num}
                              className="flex items-center gap-1.5 md:gap-2"
                            >
                              <input
                                type="radio"
                                name="correctOpt"
                                checked={newMission.correctOpt === num - 1}
                                onChange={() =>
                                  setNewMission({
                                    ...newMission,
                                    correctOpt: num - 1,
                                  })
                                }
                                className="w-3 h-3 md:w-4 md:h-4 cursor-pointer shrink-0"
                              />
                              <input
                                type="text"
                                className={`flex-1 p-1.5 md:p-2 bg-white border rounded-md md:rounded-lg text-[9px] md:text-xs font-bold outline-none ${
                                  newMission.correctOpt === num - 1
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-slate-300"
                                }`}
                                value={newMission[`opt${num}`]}
                                onChange={(e) =>
                                  setNewMission({
                                    ...newMission,
                                    [`opt${num}`]: e.target.value,
                                  })
                                }
                                placeholder={`Opção ${num}`}
                                required={num <= 2}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-1.5">
                        Habilidades (Sairá no PDF)
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full p-2.5 md:p-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg md:rounded-xl text-[9px] md:text-xs font-mono text-slate-600 focus:border-emerald-500 outline-none"
                        value={newMission.skills}
                        onChange={(e) =>
                          setNewMission({
                            ...newMission,
                            skills: e.target.value,
                          })
                        }
                        placeholder="Ex: EF04LP01"
                      />
                    </div>

                    {editingMissionId ? (
                      <div className="flex gap-1.5 md:gap-2 mt-2 md:mt-4">
                        <button
                          type="button"
                          onClick={cancelEditMission}
                          className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-black py-2.5 md:py-4 rounded-lg md:rounded-xl text-[9px] md:text-sm uppercase tracking-widest transition-all"
                        >
                          Cancelar Edição
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 md:py-4 rounded-lg md:rounded-xl text-[9px] md:text-sm uppercase tracking-widest transition-all shadow-[0_4px_0_0_#1e3a8a] hover:shadow-none hover:translate-y-1"
                        >
                          Atualizar Atividade
                        </button>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-3 md:py-4 rounded-lg md:rounded-xl text-[10px] md:text-sm uppercase tracking-widest transition-all shadow-[0_4px_0_0_#000] hover:shadow-none hover:translate-y-1 mt-2 md:mt-4"
                      >
                        💾 Salvar no Banco (Rascunho)
                      </button>
                    )}
                  </form>
                </div>

                {/* Colunas do Lado Direito do Professor */}
                <div className="lg:col-span-7 flex flex-col gap-4 md:gap-8 order-1 lg:order-2">
                  <div className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] shadow-xl border border-slate-200">
                    <h2 className="text-sm md:text-xl font-black text-slate-800 mb-3 md:mb-6 border-b-2 border-slate-100 pb-2 md:pb-4">
                      Banco de Missões
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 max-h-[250px] md:max-h-[400px] overflow-y-auto pr-1 md:pr-2 scrollbar-thin">
                      {missions.map((m) => (
                        <div
                          key={m.id}
                          className={`border p-3 md:p-5 rounded-xl md:rounded-2xl relative transition-all ${
                            m.status !== "draft"
                              ? "bg-emerald-50 border-emerald-200 shadow-sm"
                              : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1 md:mb-2">
                            <h4 className="font-bold text-slate-800 line-clamp-1 pr-2 text-xs md:text-lg">
                              {m.title}
                            </h4>
                          </div>
                          <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase mb-2 md:mb-4 flex flex-wrap items-center gap-1 md:gap-2">
                            <span
                              className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg text-white ${
                                m.status !== "draft"
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            >
                              {m.status !== "draft" ? "Publicada" : "Rascunho"}
                            </span>
                            <span>
                              {m.subject} •{" "}
                              {m.format === "objective" ? "Objetiva" : "Aberta"}
                            </span>
                            {m.targetType === "specific" && (
                              <span className="text-indigo-500 font-black ml-1">
                                (Dir)
                              </span>
                            )}
                          </p>
                          <div className="flex gap-1 md:gap-2">
                            <button
                              onClick={() =>
                                togglePublishMission(m.id, m.status)
                              }
                              className={`flex-1 text-[8px] md:text-[10px] font-black uppercase tracking-wider py-1.5 md:py-2.5 rounded-md md:rounded-xl transition-colors ${
                                m.status !== "draft"
                                  ? "bg-slate-200 hover:bg-slate-300 text-slate-700"
                                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                              }`}
                            >
                              {m.status !== "draft"
                                ? "🛑 Ocultar"
                                : "🚀 Publicar"}
                            </button>
                            <button
                              onClick={() => handleEditMission(m)}
                              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 md:px-4 py-1.5 md:py-2.5 rounded-md md:rounded-xl text-[10px] md:text-sm transition-colors"
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteMission(m.id)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-2 md:px-4 py-1.5 md:py-2.5 rounded-md md:rounded-xl text-[10px] md:text-sm transition-colors"
                              title="Excluir"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                      {missions.length === 0 && (
                        <p className="text-[10px] md:text-sm text-slate-400 font-bold col-span-full text-center py-4 md:py-6">
                          Nenhuma missão no banco.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] shadow-xl border border-slate-200 flex-1">
                    <h2 className="text-sm md:text-xl font-black text-slate-800 mb-3 md:mb-6 border-b-2 border-slate-100 pb-2 md:pb-4 flex items-center gap-1.5 md:gap-2">
                      <span className="text-emerald-500">📄</span> Entregas dos
                      Alunos
                    </h2>
                    {Object.keys(subsByStudent).length === 0 ? (
                      <div className="bg-slate-50 p-6 md:p-12 rounded-2xl md:rounded-3xl text-center border-2 border-dashed border-slate-300">
                        <p className="text-slate-500 font-bold text-xs md:text-lg">
                          Nenhum relatório recebido ainda.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 md:space-y-6">
                        {Object.entries(subsByStudent).map(
                          ([studentId, data]) => (
                            <div
                              key={studentId}
                              className="bg-slate-50 border-2 border-slate-200 rounded-xl md:rounded-[1.5rem] overflow-hidden shadow-sm"
                            >
                              <div className="bg-slate-100 p-2.5 md:p-4 border-b-2 border-slate-200 flex justify-between items-center">
                                <h3 className="font-black text-slate-800 text-xs md:text-lg flex items-center gap-1 md:gap-2">
                                  <span className="text-sm md:text-xl">👤</span>{" "}
                                  {data.name}
                                </h3>
                                <span className="bg-emerald-200 text-emerald-900 text-[8px] md:text-xs font-black uppercase tracking-widest px-2 md:px-3 py-0.5 md:py-1.5 rounded-lg md:rounded-xl">
                                  {data.docs.length} Entregas
                                </span>
                              </div>
                              <div className="p-2 md:p-4 grid sm:grid-cols-2 gap-2 md:gap-4 bg-white">
                                {data.docs.map((sub) => (
                                  <div
                                    key={sub.id}
                                    className="p-2.5 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-slate-200 flex flex-col hover:border-emerald-400 transition-colors relative"
                                  >
                                    <button
                                      onClick={() =>
                                        handleDeleteSubmission(sub.id)
                                      }
                                      className="absolute top-1.5 md:top-3 right-1.5 md:right-3 text-slate-400 hover:text-red-500 bg-slate-100 p-1 md:p-1.5 rounded-md md:rounded-lg transition-colors"
                                      title="Excluir"
                                    >
                                      <span>🗑️</span>
                                    </button>
                                    <div className="mb-1.5 md:mb-2 pr-6 md:pr-8">
                                      <p className="text-[8px] md:text-[10px] font-black text-emerald-600 uppercase tracking-wider line-clamp-1">
                                        {sub.missionTitle}
                                      </p>
                                      <span className="text-[7px] md:text-[10px] font-bold bg-slate-100 text-slate-500 px-1 md:px-2 py-0.5 rounded-md md:rounded-lg border border-slate-200 inline-block mt-0.5 md:mt-1">
                                        {sub.date}
                                      </span>
                                    </div>
                                    <div className="bg-slate-50 p-1.5 md:p-3 rounded-md md:rounded-lg border border-slate-100 mb-2 md:mb-4 flex-1">
                                      <p className="text-[9px] md:text-xs text-slate-700 line-clamp-3 font-medium italic">
                                        "{sub.answer}"
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setPrintData(sub);
                                        setView("teacher_print");
                                      }}
                                      className="w-full bg-slate-800 hover:bg-slate-900 text-white py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1 md:gap-2"
                                    >
                                      <span>🖨️</span> Gerar PDF
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {teacherTab === "students" && (
              <div className="grid lg:grid-cols-12 gap-4 md:gap-8">
                <div className="lg:col-span-4 bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] shadow-xl border border-slate-200 h-fit">
                  <h2 className="text-sm md:text-xl font-black text-slate-800 mb-3 md:mb-6 border-b-2 border-slate-100 pb-2 md:pb-4 flex items-center gap-1.5 md:gap-2">
                    <span className="text-blue-500">👤</span> Matricular Aluno
                  </h2>
                  <form
                    onSubmit={handleAddStudent}
                    className="space-y-2.5 md:space-y-4"
                  >
                    <div>
                      <label className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                        Nome Completo
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full p-2.5 md:p-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold text-slate-700 focus:border-blue-500 outline-none"
                        value={newStudent.name}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, name: e.target.value })
                        }
                        placeholder="Nome do aluno"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                        Login
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full p-2.5 md:p-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold text-slate-700 focus:border-blue-500 outline-none lowercase"
                        value={newStudent.username}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            username: e.target.value,
                          })
                        }
                        placeholder="ex: joao.silva"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                        Senha Pessoal
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full p-2.5 md:p-3.5 bg-slate-50 border-2 border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-sm font-black tracking-widest text-slate-700 focus:border-blue-500 outline-none"
                        value={newStudent.password}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            password: e.target.value,
                          })
                        }
                        placeholder="4 dígitos"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 md:py-4 rounded-lg md:rounded-xl text-[9px] md:text-sm uppercase tracking-widest transition-all mt-2 md:mt-4 shadow-[0_4px_0_0_#1e3a8a] hover:shadow-none hover:translate-y-1"
                    >
                      Matricular
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-8 bg-white rounded-2xl md:rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
                  <div className="p-3 md:p-8 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 md:gap-4">
                    <div>
                      <h2 className="text-sm md:text-xl font-black text-slate-800">
                        Turma Registrada
                      </h2>
                      <span className="bg-blue-100 text-blue-800 font-black px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg text-[9px] md:text-sm mt-1 md:mt-2 inline-block">
                        {students.length} Alunos
                      </span>
                    </div>
                    <button
                      onClick={syncStudentsFromOtherPlatform}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 md:py-2.5 px-3 md:px-5 rounded-lg md:rounded-xl text-[9px] md:text-sm flex items-center justify-center gap-1.5 md:gap-2 shadow-sm transition-colors w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      <span>🔄</span> Importar Dados
                    </button>
                  </div>

                  <div className="overflow-x-auto max-h-[300px] md:max-h-[600px] w-full">
                    <table className="w-full text-left relative min-w-[400px] md:min-w-[500px]">
                      <thead className="bg-slate-100 border-b-2 border-slate-200 text-[8px] md:text-[10px] uppercase font-black text-slate-400 tracking-widest sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="p-2 md:p-4">Aluno</th>
                          <th className="p-2 md:p-4">Credenciais</th>
                          <th className="p-2 md:p-4 text-center">Nível</th>
                          <th className="p-2 md:p-4 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {students.map((s) => {
                          const { currentLevel } = getLevelInfo(s.xp || 0);
                          return (
                            <tr
                              key={s.id}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <td className="p-2 md:p-4">
                                <p className="font-black text-slate-800 uppercase text-[10px] md:text-sm">
                                  {s.name}
                                </p>
                              </td>
                              <td className="p-2 md:p-4">
                                <div className="text-[8px] md:text-xs font-mono font-bold text-slate-500 bg-slate-100 px-1 md:px-2 py-0.5 rounded inline-block border border-slate-200">
                                  L:
                                  <span className="text-blue-600">
                                    {s.username}
                                  </span>{" "}
                                  S:
                                  <span className="text-red-500">
                                    {s.password}
                                  </span>
                                </div>
                              </td>
                              <td className="p-2 md:p-4 text-center">
                                <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-1.5 md:px-3 py-0.5 md:py-1.5 rounded-md md:rounded-xl text-[8px] md:text-xs font-black text-slate-700 shadow-sm whitespace-nowrap">
                                  {currentLevel.icon} {currentLevel.title}
                                </span>
                              </td>
                              <td className="p-2 md:p-4 text-center">
                                <button
                                  onClick={() =>
                                    handleDeleteStudent(s.id, s.name)
                                  }
                                  className="text-red-400 hover:text-red-600 p-1 md:p-2 hover:bg-red-50 rounded-md md:rounded-lg transition-colors text-sm md:text-lg"
                                >
                                  <span>🗑️</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {students.length === 0 && (
                          <tr>
                            <td
                              colSpan="4"
                              className="p-4 md:p-8 text-center text-slate-400 font-bold text-[10px] md:text-sm"
                            >
                              Nenhum aluno matriculado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TELA DE IMPRESSÃO - PROFESSOR */}
      {view === "teacher_print" && printData && (
        <div className="min-h-screen bg-slate-300 p-2 md:p-8 flex flex-col items-center font-sans">
          <style
            dangerouslySetInnerHTML={{
              __html: `@media print { body * { visibility: hidden; } #printable-area, #printable-area * { visibility: visible; } #printable-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 1.5cm; box-shadow: none; border: none; } .no-print { display: none !important; } @page { margin: 0; } }`,
            }}
          />

          <div className="no-print w-full max-w-[21cm] mb-3 md:mb-6 flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-4 bg-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-xl border border-slate-200">
            <button
              onClick={() => setView("teacher_dash")}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 md:gap-2 text-slate-600 hover:text-slate-900 font-black uppercase tracking-wider bg-slate-100 px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl transition-colors text-[10px] md:text-sm"
            >
              <span>⬅️</span> Voltar
            </button>
            <button
              onClick={() => {
                try {
                  window.print();
                } catch (e) {}
              }}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2 md:py-3 px-4 md:px-8 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 shadow-[0_4px_0_0_#065f46] hover:shadow-none hover:translate-y-1 transition-all text-[9px] md:text-xs uppercase tracking-wider"
            >
              <span>🖨️</span> Imprimir Documento
            </button>
          </div>

          <div
            id="printable-area"
            className="bg-white w-full max-w-[21cm] min-h-[29.7cm] p-4 md:p-12 shadow-2xl relative text-black overflow-x-hidden"
          >
            <div className="text-center border-b-[3px] md:border-b-4 border-black pb-3 md:pb-6 mb-4 md:mb-8">
              <h1 className="font-black text-sm md:text-2xl uppercase tracking-widest mb-1">
                EM Dr. Benedito Laporte Vieira da Motta
              </h1>
              <h2 className="font-bold text-xs md:text-lg uppercase tracking-widest text-slate-700">
                Turma Registrada
              </h2>
              <h3 className="font-black text-xs md:text-xl mt-1.5 md:mt-3 uppercase border bg-black text-white inline-block px-2 md:px-4 py-0.5 md:py-1">
                REGISTRO DE ATIVIDADE ESCOLAR
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 mb-4 md:mb-8 border-[2px] border-black">
              <div className="sm:col-span-2 sm:border-r-[2px] border-b-[2px] sm:border-b-0 border-black p-2 md:p-4">
                <p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">
                  Identificação do Aluno(a)
                </p>
                <p className="font-black text-base md:text-xl uppercase">
                  {printData.studentName}
                </p>
              </div>
              <div className="p-2 md:p-4 flex flex-col justify-center">
                <p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">
                  Data da Entrega
                </p>
                <p className="font-black text-sm md:text-lg">
                  {printData.date}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-6">
              <div className="mb-1 md:mb-2">
                <h3 className="font-black text-[10px] md:text-sm uppercase tracking-widest mb-1.5 md:mb-3 bg-gray-200 p-1.5 md:p-2 border-l-[3px] md:border-l-4 border-black">
                  Detalhes da Missão
                </h3>
                <div className="px-1 md:px-2 text-[10px] md:text-sm font-medium">
                  <p className="mb-1 md:mb-2 text-xs md:text-base">
                    <span className="font-black">Título:</span>{" "}
                    {printData.missionTitle}
                  </p>
                  <p className="mb-1 md:mb-2 text-xs md:text-base">
                    <span className="font-black">Componente Curricular:</span>{" "}
                    {printData.subject}
                  </p>
                  <p className="mb-2 md:mb-4 text-xs md:text-base">
                    <span className="font-black">Habilidades BNCC:</span>{" "}
                    <span className="font-mono text-gray-700 bg-gray-100 px-1 md:px-2 py-0.5 rounded break-all">
                      {printData.skills}
                    </span>
                  </p>

                  <div className="bg-white border-[2px] border-slate-300 p-2 md:p-4 mt-2 md:mt-4 mb-2 md:mb-4 rounded-lg">
                    <span className="font-black text-slate-600 block mb-1 md:mb-2 text-[8px] md:text-[10px] uppercase tracking-widest">
                      Comando Pedagógico Original:
                    </span>

                    {/* Imagem de Ilustração no Relatório PDF (Se existir) */}
                    {printData.imageUrl && (
                      <div className="mb-3 border border-slate-200 p-1 flex justify-center bg-slate-50">
                        <img
                          src={printData.imageUrl}
                          alt="Ilustração"
                          className="max-w-full max-h-[200px] object-contain"
                        />
                      </div>
                    )}

                    <p className="text-justify text-[10px] md:text-base italic text-slate-800 break-words">
                      {printData.prompt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pb-6 md:pb-12">
                <h3 className="font-black text-[10px] md:text-sm uppercase tracking-widest mb-1.5 md:mb-3 bg-gray-200 p-1.5 md:p-2 border-l-[3px] md:border-l-4 border-black">
                  Produção do Aluno (Registro)
                </h3>
                <div className="bg-gray-50 border border-gray-400 p-3 md:p-5 rounded-lg shadow-sm">
                  <div className="whitespace-pre-wrap text-justify text-xs md:text-base leading-relaxed break-words">
                    {printData.answer}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
