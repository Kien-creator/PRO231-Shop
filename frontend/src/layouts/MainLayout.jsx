import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'; // Import Header instead of NavBar
import Footer from '../components/Footer';

const { Content, Footer: AntFooter } = Layout;

export default function MainLayout() {
  return (
    <Layout>
      <Header /> 
      <Content style={{ minHeight: '80vh' }}>
        <Outlet />
      </Content>
      <AntFooter>
        <Footer />
      </AntFooter>
    </Layout>
  );
}