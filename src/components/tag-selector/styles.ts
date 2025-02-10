export const stylesDetails = {
  select: {
    '.ant-select-selector': {
      borderRadius: '4px !important',
      border: '1px solid rgb(225, 223, 221) !important',
      backgroundColor: 'transparent !important',
      transition: 'all 0.1s ease-in-out !important',
      '&:hover': {
        borderColor: 'rgb(200, 198, 196) !important',
      },
    },
    '.ant-select-selection-item': {
      color: 'rgb(50, 49, 48) !important',
      fontSize: '14px !important',
    },
    '.ant-select-selection-placeholder': {
      color: 'rgb(96, 94, 92) !important',
      fontSize: '14px !important',
    },
  },
  input: {
    height: '32px',
    borderRadius: '4px',
    border: '1px solid rgb(225, 223, 221)',
    padding: '0 8px',
    fontSize: '14px',
    '&:focus': {
      borderColor: 'rgb(0, 120, 212)',
      boxShadow: 'none',
      outline: 'none',
    },
    '&:hover': {
      borderColor: 'rgb(200, 198, 196)',
    },
  },
  button: {
    color: 'rgb(50, 49, 48)',
    '&:hover': {
      backgroundColor: 'rgb(243, 242, 241)',
    },
  },
};
