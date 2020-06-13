import { ToastContainer } from 'react-toastify';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

const StyledToastContainer = styled(ToastContainer).attrs({
  // custom props
})`
  .Toastify__toast-container {
  }
  .Toastify__toast {
    padding-left: 20px;

    ${media.largeMobile(css`
      border-radius: 5px;
    `)};
  }
  .Toastify__toast--error {
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
  }
  .Toastify__toast--dark {
    background-color: #212121;
  }
  .Toastify__toast-body {
  }
  .Toastify__progress-bar {
  }
`;

export default StyledToastContainer;
