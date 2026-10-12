'use client';

import React from 'react';
import { TopBar } from './TopBar';
import { NavBar } from '../navigation/NavBar';

export const Header: React.FC = () => {
  return (
    <header className="w-full">
      <TopBar />
      <NavBar />
    </header>
  );
};
