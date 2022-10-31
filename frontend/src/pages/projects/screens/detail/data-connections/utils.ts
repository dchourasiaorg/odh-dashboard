import * as React from 'react';
import { deleteSecret } from '../../../../../api';
import { K8sStatus } from '../../../../../k8sTypes';
import { DataConnection, DataConnectionAWS, DataConnectionType } from '../../../types';
import { getSecretDescription, getSecretDisplayName } from '../../../utils';
import { DATA_CONNECTION_TYPES } from './connectionRenderers';

export const isDataConnectionAWS = (
  dataConnection: DataConnection,
): dataConnection is DataConnectionAWS => dataConnection.type === DataConnectionType.AWS;

export const getDataConnectionId = (dataConnection: DataConnection): string => {
  if (isDataConnectionAWS(dataConnection)) {
    return dataConnection.data.metadata.uid || dataConnection.data.metadata.name;
  }

  throw new Error('Invalid data connection type');
};

export const getDataConnectionResourceName = (dataConnection: DataConnection): string => {
  if (isDataConnectionAWS(dataConnection)) {
    return dataConnection.data.metadata.name;
  }

  throw new Error('Invalid data connection type');
};

export const getDataConnectionDisplayName = (dataConnection: DataConnection): string => {
  if (isDataConnectionAWS(dataConnection)) {
    return getSecretDisplayName(dataConnection.data);
  }

  throw new Error('Invalid data connection type');
};

export const getDataConnectionDescription = (dataConnection: DataConnection): string => {
  if (isDataConnectionAWS(dataConnection)) {
    return getSecretDescription(dataConnection.data);
  }

  return '';
};

export const getDataConnectionType = (dataConnection: DataConnection): React.ReactNode => {
  const connectionType = DATA_CONNECTION_TYPES[dataConnection.type];
  if (connectionType) {
    return connectionType;
  }

  throw new Error('Invalid data connection type');
};

export const getDataConnectionProvider = (dataConnection: DataConnection): string => {
  switch (dataConnection.type) {
    case DataConnectionType.AWS:
      return 'AWS S3';
    default:
      throw new Error('Invalid data connection type');
  }
};

export const deleteDataConnection = (dataConnection: DataConnection): Promise<K8sStatus> => {
  switch (dataConnection.type) {
    case DataConnectionType.AWS:
      return deleteSecret(
        dataConnection.data.metadata.namespace,
        dataConnection.data.metadata.name,
      );
    default:
      throw new Error('Invalid data connection type');
  }
};