/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import Image from "next/image";
import logoPic from "/public/logo.svg"

type Style={
  width: string
};

const LogoPic = ({width} : Style)=> {
  return (
    <>
    <Image src={logoPic} width={parseInt(width)} alt="Logo" />
    </>
  )
}

export default LogoPic