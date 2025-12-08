import React, { useContext, createContext, useState, useEffect } from 'react';
import { axiosInstance, setupAxios } from '../common/axios';
import qdrantClient from '../common/client';
import { bigIntJSON } from '../common/bigIntJSON';
import { isTokenRestricted } from '../config/restricted-routes';

const DEFAULT_SETTINGS = {
  apiKey: '',
};

// 将设置写入本地存储
const persistSettings = (settings) => {
  localStorage.setItem('settings', bigIntJSON.stringify(settings));
};

// 从本地存储获取现有设置或设置默认值
const getPersistedSettings = () => {
  const settings = localStorage.getItem('settings');

  if (settings) return bigIntJSON.parse(settings);

  return DEFAULT_SETTINGS;
};

// React context 用于存储设置
const ClientContext = createContext();

// React hook 用于访问和修改设置
export const useClient = () => {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error('useClient 必须在 ClientProvider 内使用');
  }

  return {
    ...context,
    isRestricted: isTokenRestricted(context.settings.apiKey),
  };
};

// 客户端上下文提供者
export const ClientProvider = (props) => {
  // TODO: 如果有更多设置需要跟踪，切换到 Reducer
  const [settings, setSettings] = useState(getPersistedSettings());

  const client = qdrantClient(settings);

  setupAxios(axiosInstance, settings);

  useEffect(() => {
    setupAxios(axiosInstance, settings);
    persistSettings(settings);
  }, [settings]);

  return <ClientContext.Provider value={{ client, settings, setSettings }} {...props} />;
};
