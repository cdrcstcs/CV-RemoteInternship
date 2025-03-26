import AIRecolor from "./Recolor"
import GenerativeFill from "./GenerativeFill"
import GenRemove from "./GenRemove"
import BgRemove from "./BgRemove"
import AIBackgroundReplace from "./BgReplace"
import ExtractPart from "./ExtractPart"

export default function ImageTools() {
  return (
    <>
      <GenerativeFill />
      <AIRecolor />
      <GenRemove />
      <AIBackgroundReplace />
      <ExtractPart />
      <BgRemove />
    </>
  )
}
