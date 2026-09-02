import React from 'react';
import { Routes, Route } from 'react-router-dom';

export const publicRoutes = [
  { path: '/', component: 'Home' },
  { path: '/about', component: 'About' },
  { path: '/sermons', component: 'Sermons' },
  { path: '/sermons/:id', component: 'SermonDetail' },
  { path: '/events', component: 'Events' },
  { path: '/events/:id', component: 'EventDetail' },
  { path: '/give', component: 'Give' },
  { path: '/ministries', component: 'Ministries' },
  { path: '/ministries/:id', component: 'MinistryDetail' },
  { path: '/contact', component: 'Contact' },
  { path: '/login', component: 'Login' },
  { path: '/register', component: 'Register' },
];

export const adminRoutes = [
  { path: '/admin', component: 'AdminDashboard' },
  { path: '/admin/sermons', component: 'AdminSermons' },
  { path: '/admin/events', component: 'AdminEvents' },
  { path: '/admin/giving', component: 'AdminGiving' },
  { path: '/admin/users', component: 'AdminUsers' },
  { path: '/admin/settings', component: 'AdminSettings' },
];