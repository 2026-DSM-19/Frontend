import styled from "@emotion/styled";

const Footer = () => {
  return (
    <FooterWrapper>
      <p>© 2026 Team19 - SafeScope. All rights reserved.</p>
    </FooterWrapper>
  );
};

/* ──────────────── 풋터 전체 래퍼 ──────────────── */
const FooterWrapper = styled.footer`
  width: 100%;
  height: 30px;
  padding: 10px;
  background-color: #f5f5f5;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    font-family: "Pretendard GOV", sans-serif;
    font-weight: 400;
    margin: 5px;
    font-size: 13px;
    color: #666;
    text-align: center;
    text-decoration: none;
  }
`;

export default Footer;
