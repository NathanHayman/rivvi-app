import styled, { css } from "styled-components";

interface Props {
  layout: string;
}

const Layout = styled.div<Props>`
  ${({ layout }) => css`
    display: flex;
    flex-direction: ${layout === "left" ? "row" : "row-reverse"};
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #f0f0f0;
  `}
`;

const ContentLayoutPreview = (props: Props) => {
  const { layout } = props;

  return (
    <Layout layout={layout}>
      <div className="h-1/2 w-1/2 bg-gray-200"></div>
      <div className="h-1/2 w-1/2 bg-gray-200"></div>
    </Layout>
  );
};

export default ContentLayoutPreview;
