import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

export default function Footer() {
  return (
    <AntFooter style={{ textAlign: 'center'}}>
      My Website ©2025 Created by Kien
    </AntFooter>
  );
}