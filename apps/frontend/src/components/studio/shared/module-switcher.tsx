import ModuleWrap from "@/components/layout/wrap/module";

import Accordion from "../modules/accordion";
import CallToAction from "../modules/call-to-action";
import ContentImage from "../modules/content/image";
import ContentAll from "../modules/content/types/all";
import Grid from "../modules/grid";
import Header from "../modules/header";
import ImageModule from "../modules/image/module";

export default function ModuleSwitcher({ modules }: { modules: any }) {
  return (
    <>
      {modules &&
        modules.map((module: any, i: number) => {
          let moduleType = module._type;
          let moduleKey = `${module._key} + ${i}`;
          switch (moduleType) {
            case "module.accordion":
              return <Accordion data={module} key={moduleKey} />;
            case "module.callToAction":
              return <CallToAction data={module} key={moduleKey} />;
            case "module.contentImage":
              return (
                <ModuleWrap key={moduleKey}>
                  <ContentImage data={module} />
                </ModuleWrap>
              );
            case "module.image": {
              return (
                <ModuleWrap key={moduleKey}>
                  <ImageModule data={module} />
                </ModuleWrap>
              );
            }
            case "module.contentPlain":
              return <ModuleWrap key={moduleKey}>Content Plain</ModuleWrap>;
            case "module.grid":
              return <Grid data={module} key={moduleKey} />;
            case "module.header":
              return <Header data={module} key={moduleKey} />;
            case "module.imageModule":
              return <ImageModule data={module} key={moduleKey} />;
            default:
              return <ContentAll data={module} key={moduleKey} />;
          }
        })}
    </>
  );
}
