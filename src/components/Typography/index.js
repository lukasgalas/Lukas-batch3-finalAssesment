import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Typography } from "@material-ui/core";
import useStyles from "./style";

const getVariant = variant => {
  const variantDefault = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "subtitle1",
    "subtitle2",
    "body1",
    "body2",
    "caption",
    "button",
    "overline",
    "srOnly",
    "inherit"
  ];
  const variantCustom = {
    span: "subtitle1",
    title: "h1",
    p: "body1",
    label: "caption"
  };
  if (variantDefault.indexOf(variant) > -1) {
    return variant;
  } else {
    return variantCustom[variant];
  }
};

const CustomTypography = ({
  variant,
  type,
  className = {},
  children,
  align = "left",
  letter = "",
  decoration = ''
}) => {
  const styles = useStyles();
  let customStyle = classNames(
    styles.root,
    styles[letter],
    styles[variant],
    styles[type],
    styles[align],
    styles[decoration],
    className
  );
  let variantType = getVariant(variant);
  return (
    <Typography variant={variantType} className={customStyle} align={align}>
      {children}
    </Typography>
  );
};

CustomTypography.propTypes = {
  variant: PropTypes.oneOf([
    "h1",
    "h2",
    "h3",
    "h6",
    "p",
    "span",
    "title",
    "label"
  ]),
  type: PropTypes.oneOf(["bold", "italic", "semiBold", "reguler"]),
  className: PropTypes.string
};

export default CustomTypography;
