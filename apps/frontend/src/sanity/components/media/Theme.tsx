import styled, { css } from "styled-components";

interface Props {
  background?: string;
  text?: string;
  buttonBackground?: string;
  buttonText?: string;
  outlineBtn?: string;
}

interface StyledSpanProps {
  background?: string;
}

interface StyledButtonProps {
  buttonBackground?: string;
  buttonText?: string;
}

interface StyledOutlineButtonProps {
  outlineBtn?: string;
}

const StyledOutlineButton = styled.button<StyledOutlineButtonProps>(
  ({ outlineBtn }) => {
    const bg = outlineBtn || "white";

    return css`
      background-color: transparent;
      border: 1px solid ${bg};
      border-radius: 0.5rem;
      color: ${bg};
      cursor: pointer;
      font-size: 0.5rem;
      font-weight: 600;
      padding: 0.05rem 0.25rem;
      transition: all 0.15s ease-in-out;

      &:hover {
        background-color: ${bg};
        color: white;
      }
    `;
  },
);

const StyledButton = styled.button<StyledButtonProps>(
  ({ buttonBackground, buttonText }) => {
    const bg = buttonBackground || "white";
    const txt = buttonText || "black";

    return css`
      background-color: ${bg};
      border: 1px solid ${bg};
      border-radius: 0.5rem;
      color: ${txt};
      cursor: pointer;
      font-size: 0.5rem;
      font-weight: 600;
      padding: 0.05rem 0.25rem;
      transition: all 0.15s ease-in-out;

      &:hover {
        background-color: ${txt};
        color: ${bg};
      }
    `;
  },
);

const StyledSpan = styled.span<StyledSpanProps>(({ background }) => {
  const bg = background || "white";

  return css`
    align-items: center;
    background-color: ${bg};
    border-radius: inherit;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    overflow: hidden;
    width: 100%;
  `;
});

const ThemePreview = (props: Props) => {
  const { background, text, buttonBackground, buttonText, outlineBtn } = props;

  return (
    <StyledSpan background={background}>
      {text && (
        <span style={{ color: text, fontSize: ".75em", fontWeight: 600 }}>
          Text
        </span>
      )}
      <div style={{ display: "flex", flexDirection: "row" }}>
        {buttonBackground && buttonText && (
          <StyledButton
            buttonBackground={buttonBackground}
            buttonText={buttonText}
          >
            1
          </StyledButton>
        )}
        {outlineBtn && (
          <StyledOutlineButton outlineBtn={outlineBtn}>2</StyledOutlineButton>
        )}
      </div>
    </StyledSpan>
  );
};

export default ThemePreview;
