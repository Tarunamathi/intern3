import imgLogo from "figma:asset/4c5b75d1d1f44b879cc0ffb4b315ece4b0ebb532.png";
import imgBg from "figma:asset/4315496bc5670401895bda2a44959ee5909cd454.png";
import imgGradient from "figma:asset/84b46758cf032fd795cecf60b64632dede907894.png";

function NoZoomLogopVariant() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center justify-center relative shrink-0 w-[130px]" data-name="no zoom logop/Variant2">
      <div className="h-[93px] relative shadow-[0px_4px_109px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
    </div>
  );
}

function NoZoomLogop() {
  return (
    <div className="absolute content-stretch flex flex-col h-[93px] items-center justify-center left-[calc(87.5%-19px)] top-[56px] w-[130px]" data-name="no zoom logop">
      <NoZoomLogopVariant />
    </div>
  );
}

function Mask() {
  return (
    <div className="absolute bg-white inset-[-50px]" data-name="Mask">
      <div className="absolute bg-black inset-[76px] rounded-[34px]" data-name="Shape" />
    </div>
  );
}

function Blur() {
  return <div className="absolute backdrop-blur-2xl backdrop-filter bg-[rgba(255,255,255,0.08)] blur-[20px] filter inset-[31px_26px_21px_26px] mix-blend-hard-light rounded-[34px]" data-name="Blur" />;
}

function Shadow() {
  return (
    <div className="absolute inset-[-26px_-26.32px_-26px_-26px]" data-name="Shadow">
      <Mask />
      <Blur />
    </div>
  );
}

function Fill() {
  return (
    <div className="absolute bottom-0 left-0 right-[-0.32px] rounded-[34px] top-0" data-name="Fill">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[34px]">
        <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
        <div className="absolute bg-[rgba(0,0,0,0.04)] inset-0 rounded-[34px]" />
      </div>
    </div>
  );
}

function GlassEffect() {
  return <div className="absolute bg-[rgba(0,0,0,0)] bottom-0 left-0 right-[-0.32px] rounded-[34px] top-0" data-name="Glass Effect" />;
}

function LiquidGlassRegularLarge() {
  return (
    <div className="h-[133px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Liquid Glass - Regular - Large">
      <Shadow />
      <Fill />
      <GlassEffect />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Inter:Black',sans-serif] font-black inset-[18.05%_14.48%_18.05%_14.04%] items-center justify-center leading-[normal] not-italic text-white">
      <p className="min-w-full relative shrink-0 text-[40px] text-center w-[min-content]">75</p>
      <p className="relative shrink-0 text-[13px] text-nowrap whitespace-pre">Total Courses</p>
    </div>
  );
}

function Component2Glass() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] items-center justify-center left-[calc(12.5%+98.68px)] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.08),0px_4px_4px_0px_rgba(250,250,250,0.7),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[204px] w-[156.682px]" data-name="2 glass">
      <LiquidGlassRegularLarge />
      <Frame />
      <div className="absolute inset-0 pointer-events-none shadow-[0px_4px_4px_0px_inset_rgba(250,250,250,0.7),0px_4px_4px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Mask1() {
  return (
    <div className="absolute bg-white inset-[-50px]" data-name="Mask">
      <div className="absolute bg-black inset-[76px] rounded-[34px]" data-name="Shape" />
    </div>
  );
}

function Blur1() {
  return <div className="absolute backdrop-blur-2xl backdrop-filter bg-[rgba(255,255,255,0.08)] blur-[20px] filter inset-[31px_26px_21px_26px] mix-blend-hard-light rounded-[34px]" data-name="Blur" />;
}

function Shadow1() {
  return (
    <div className="absolute inset-[-26px_-26.32px_-26px_-26px]" data-name="Shadow">
      <Mask1 />
      <Blur1 />
    </div>
  );
}

function Fill1() {
  return (
    <div className="absolute bottom-0 left-0 right-[-0.32px] rounded-[34px] top-0" data-name="Fill">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[34px]">
        <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
        <div className="absolute bg-[rgba(0,0,0,0.04)] inset-0 rounded-[34px]" />
      </div>
    </div>
  );
}

function GlassEffect1() {
  return <div className="absolute bg-[rgba(0,0,0,0)] bottom-0 left-0 right-[-0.32px] rounded-[34px] top-0" data-name="Glass Effect" />;
}

function LiquidGlassRegularLarge1() {
  return (
    <div className="h-[133px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Liquid Glass - Regular - Large">
      <Shadow1 />
      <Fill1 />
      <GlassEffect1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Inter:Black',sans-serif] font-black inset-[18.05%_14.48%_18.05%_14.04%] items-center justify-center leading-[normal] not-italic text-white">
      <p className="min-w-full relative shrink-0 text-[40px] text-center w-[min-content]">30</p>
      <p className="relative shrink-0 text-[13px] text-nowrap whitespace-pre">Total Trainers</p>
    </div>
  );
}

function Component3Glass() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] items-center justify-center left-[calc(25%+143.36px)] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.08),0px_4px_4px_0px_rgba(250,250,250,0.7),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[204px] w-[156.682px]" data-name="3 glass">
      <LiquidGlassRegularLarge1 />
      <Frame1 />
      <div className="absolute inset-0 pointer-events-none shadow-[0px_4px_4px_0px_inset_rgba(250,250,250,0.7),0px_4px_4px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Mask2() {
  return (
    <div className="absolute bg-white inset-[-50px]" data-name="Mask">
      <div className="absolute bg-black inset-[76px] rounded-[34px]" data-name="Shape" />
    </div>
  );
}

function Blur2() {
  return <div className="absolute backdrop-blur-2xl backdrop-filter bg-[rgba(255,255,255,0.08)] blur-[20px] filter inset-[31px_26px_21px_26px] mix-blend-hard-light rounded-[34px]" data-name="Blur" />;
}

function Shadow2() {
  return (
    <div className="absolute inset-[-26px_-26.32px_-26px_-26px]" data-name="Shadow">
      <Mask2 />
      <Blur2 />
    </div>
  );
}

function Fill2() {
  return (
    <div className="absolute bottom-0 left-0 right-[-0.32px] rounded-[34px] top-0" data-name="Fill">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[34px]">
        <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
        <div className="absolute bg-[rgba(0,0,0,0.04)] inset-0 rounded-[34px]" />
      </div>
    </div>
  );
}

function GlassEffect2() {
  return <div className="absolute bg-[rgba(0,0,0,0)] bottom-0 left-0 right-[-0.32px] rounded-[34px] top-0" data-name="Glass Effect" />;
}

function LiquidGlassRegularLarge2() {
  return (
    <div className="h-[133px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Liquid Glass - Regular - Large">
      <Shadow2 />
      <Fill2 />
      <GlassEffect2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Inter:Black',sans-serif] font-black inset-[18.8%_14.48%_17.29%_14.04%] items-center justify-center leading-[normal] not-italic text-white">
      <p className="min-w-full relative shrink-0 text-[40px] text-center w-[min-content]">450</p>
      <p className="relative shrink-0 text-[13px] text-nowrap whitespace-pre">Total Trainees</p>
    </div>
  );
}

function Component4Glass() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] items-center justify-center left-[calc(50%+28.04px)] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.08),0px_4px_4px_0px_rgba(250,250,250,0.7),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[204px] w-[156.682px]" data-name="4 glass">
      <LiquidGlassRegularLarge2 />
      <Frame2 />
      <div className="absolute inset-0 pointer-events-none shadow-[0px_4px_4px_0px_inset_rgba(250,250,250,0.7),0px_4px_4px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Mask3() {
  return (
    <div className="absolute bg-white inset-[-50px]" data-name="Mask">
      <div className="absolute bg-black inset-[76px] rounded-[34px]" data-name="Shape" />
    </div>
  );
}

function Blur3() {
  return <div className="absolute backdrop-blur-2xl backdrop-filter bg-[rgba(255,255,255,0.08)] blur-[20px] filter inset-[31px_26px_21px_26px] mix-blend-hard-light rounded-[34px]" data-name="Blur" />;
}

function Shadow3() {
  return (
    <div className="absolute inset-[-26px_-26.32px_-26px_-26px]" data-name="Shadow">
      <Mask3 />
      <Blur3 />
    </div>
  );
}

function Fill3() {
  return (
    <div className="absolute bottom-0 left-0 right-[-0.32px] rounded-[34px] top-0" data-name="Fill">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[34px]">
        <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
        <div className="absolute bg-[rgba(0,0,0,0.04)] inset-0 rounded-[34px]" />
      </div>
    </div>
  );
}

function GlassEffect3() {
  return <div className="absolute bg-[rgba(0,0,0,0)] bottom-0 left-0 right-[-0.32px] rounded-[34px] top-0" data-name="Glass Effect" />;
}

function LiquidGlassRegularLarge3() {
  return (
    <div className="h-[133px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Liquid Glass - Regular - Large">
      <Shadow3 />
      <Fill3 />
      <GlassEffect3 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Inter:Black',sans-serif] font-black inset-[18.8%_14.48%_17.29%_14.04%] items-center justify-center leading-[normal] not-italic text-white">
      <p className="min-w-full relative shrink-0 text-[40px] text-center w-[min-content]">50</p>
      <p className="relative shrink-0 text-[13px] text-nowrap whitespace-pre">Total Batches</p>
    </div>
  );
}

function Component5Glass() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] items-center justify-center left-[calc(62.5%+72.73px)] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.08),0px_4px_4px_0px_rgba(250,250,250,0.7),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[204px] w-[156.682px]" data-name="5 glass">
      <LiquidGlassRegularLarge3 />
      <Frame3 />
      <div className="absolute inset-0 pointer-events-none shadow-[0px_4px_4px_0px_inset_rgba(250,250,250,0.7),0px_4px_4px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Mask4() {
  return (
    <div className="absolute bg-white inset-[-50px]" data-name="Mask">
      <div className="absolute bg-black inset-[76px] rounded-[34px]" data-name="Shape" />
    </div>
  );
}

function Blur4() {
  return <div className="absolute backdrop-blur-2xl backdrop-filter bg-[rgba(255,255,255,0.08)] blur-[20px] filter inset-[31px_26px_21px_26px] mix-blend-hard-light rounded-[34px]" data-name="Blur" />;
}

function Shadow4() {
  return (
    <div className="absolute inset-[-26px_-26.32px_-26px_-26px]" data-name="Shadow">
      <Mask4 />
      <Blur4 />
    </div>
  );
}

function Fill4() {
  return (
    <div className="absolute bottom-0 left-0 right-[-0.32px] rounded-[34px] top-0" data-name="Fill">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[34px]">
        <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
        <div className="absolute bg-[rgba(0,0,0,0.04)] inset-0 rounded-[34px]" />
      </div>
    </div>
  );
}

function GlassEffect4() {
  return <div className="absolute bg-[rgba(0,0,0,0)] bottom-0 left-0 right-[-0.32px] rounded-[34px] top-0" data-name="Glass Effect" />;
}

function LiquidGlassRegularLarge4() {
  return (
    <div className="h-[133px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Liquid Glass - Regular - Large">
      <Shadow4 />
      <Fill4 />
      <GlassEffect4 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Inter:Black',sans-serif] font-black inset-[18.8%_14.48%_17.29%_14.04%] items-center justify-center leading-[normal] not-italic text-white">
      <p className="relative shrink-0 text-[40px] text-center w-[128px]">3500</p>
      <p className="relative shrink-0 text-[13px] text-nowrap whitespace-pre">Total Enrollment</p>
    </div>
  );
}

function Component6Glass() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] items-center justify-center left-[calc(75%+117.41px)] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.08),0px_4px_4px_0px_rgba(250,250,250,0.7),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[204px] w-[156.682px]" data-name="6 glass">
      <LiquidGlassRegularLarge4 />
      <Frame4 />
      <div className="absolute inset-0 pointer-events-none shadow-[0px_4px_4px_0px_inset_rgba(250,250,250,0.7),0px_4px_4px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Mask5() {
  return (
    <div className="absolute bg-white inset-[-50px]" data-name="Mask">
      <div className="absolute bg-black inset-[76px] rounded-[34px]" data-name="Shape" />
    </div>
  );
}

function Blur5() {
  return <div className="absolute backdrop-blur-2xl backdrop-filter bg-[rgba(255,255,255,0.08)] blur-[20px] filter inset-[31px_26px_21px_26px] mix-blend-hard-light rounded-[34px]" data-name="Blur" />;
}

function Shadow5() {
  return (
    <div className="absolute inset-[-26px_-26.32px_-26px_-26px]" data-name="Shadow">
      <Mask5 />
      <Blur5 />
    </div>
  );
}

function Fill5() {
  return (
    <div className="absolute bottom-0 left-0 right-[-0.32px] rounded-[34px] top-0" data-name="Fill">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[34px]">
        <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
        <div className="absolute bg-[rgba(0,0,0,0.04)] inset-0 rounded-[34px]" />
      </div>
    </div>
  );
}

function GlassEffect5() {
  return <div className="absolute bg-[rgba(0,0,0,0)] bottom-0 left-0 right-[-0.32px] rounded-[34px] top-0" data-name="Glass Effect" />;
}

function LiquidGlassRegularLarge5() {
  return (
    <div className="h-[133px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Liquid Glass - Regular - Large">
      <Shadow5 />
      <Fill5 />
      <GlassEffect5 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Inter:Black',sans-serif] font-black inset-[18.05%_14.48%_18.05%_14.04%] items-center justify-center leading-[normal] not-italic text-white">
      <p className="min-w-full relative shrink-0 text-[40px] text-center w-[min-content]">120</p>
      <p className="relative shrink-0 text-[13px] text-nowrap whitespace-pre">Total Institutions</p>
    </div>
  );
}

function Component1Glass() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] items-center justify-center left-[52px] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.08),0px_4px_4px_0px_rgba(250,250,250,0.7),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[204px] w-[156.682px]" data-name="1 glass">
      <LiquidGlassRegularLarge5 />
      <Frame5 />
      <div className="absolute inset-0 pointer-events-none shadow-[0px_4px_4px_0px_inset_rgba(250,250,250,0.7),0px_4px_4px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[52px] top-[204px]">
      <Component2Glass />
      <Component3Glass />
      <Component4Glass />
      <Component5Glass />
      <Component6Glass />
      <Component1Glass />
    </div>
  );
}

function Component2Default() {
  return (
    <div className="absolute content-stretch flex flex-col h-[16px] items-center justify-center left-[97px] top-[412px] w-[230px]" data-name="Component 2/Default">
      <div className="aspect-[991/155] shrink-0 w-full" data-name="image 4" />
      <div className="aspect-[991/127] shrink-0 w-full" data-name="image 5" />
    </div>
  );
}

function Frame11() {
  return <div className="absolute h-[175px] left-[72px] top-[379px] w-[533px]" />;
}

function Frame10() {
  return <div className="h-[50px] shrink-0 w-[575px]" />;
}

function Frame14() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] items-start left-[calc(50%+22px)] p-[10px] top-[353px] w-[553px]">
      <Frame10 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[10px] relative w-full">
          <p className="font-['HeliosExt:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Enrollment Process</p>
        </div>
      </div>
    </div>
  );
}

function EnrollTitle() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-start justify-center p-[10px] relative shrink-0 w-[651px]" data-name="enroll title">
      <Frame7 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[10px] h-[50px] items-start left-[50px] top-[401px] w-[575.536px]">
      <EnrollTitle />
    </div>
  );
}

function Mask6() {
  return (
    <div className="absolute bg-white inset-[-50px]" data-name="Mask">
      <div className="absolute bg-black inset-[76px] rounded-[34px]" data-name="Shape" />
    </div>
  );
}

function Blur6() {
  return <div className="absolute backdrop-blur-2xl backdrop-filter bg-[rgba(255,255,255,0.08)] blur-[20px] filter inset-[31px_26px_21px_26px] mix-blend-hard-light rounded-[34px]" data-name="Blur" />;
}

function Shadow6() {
  return (
    <div className="absolute inset-[-26px]" data-name="Shadow">
      <Mask6 />
      <Blur6 />
    </div>
  );
}

function Fill6() {
  return (
    <div className="absolute inset-0 rounded-[34px]" data-name="Fill">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[34px]">
        <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
        <div className="absolute bg-[rgba(0,0,0,0.04)] inset-0 rounded-[34px]" />
      </div>
    </div>
  );
}

function GlassEffect6() {
  return <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[34px]" data-name="Glass Effect" />;
}

function LiquidGlassRegularLarge6() {
  return (
    <div className="h-[133px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Liquid Glass - Regular - Large">
      <Shadow6 />
      <Fill6 />
      <GlassEffect6 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[18.8%_14.48%_17.29%_14.04%] items-center justify-center">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[normal] not-italic relative shrink-0 text-[22px] text-nowrap text-white whitespace-pre">Chart: Registration → Completed</p>
    </div>
  );
}

function Enroll() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] h-[125px] items-center justify-center left-[49px] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.08),0px_4px_4px_0px_rgba(250,250,250,0.7),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[451px] w-[581px]" data-name="enroll">
      <LiquidGlassRegularLarge6 />
      <Frame6 />
      <div className="absolute inset-0 pointer-events-none shadow-[0px_4px_4px_0px_inset_rgba(250,250,250,0.7),0px_4px_4px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Mask7() {
  return (
    <div className="absolute bg-white inset-[-50px]" data-name="Mask">
      <div className="absolute bg-black inset-[76px] rounded-[34px]" data-name="Shape" />
    </div>
  );
}

function Blur7() {
  return <div className="absolute backdrop-blur-2xl backdrop-filter bg-[rgba(255,255,255,0.08)] blur-[20px] filter inset-[31px_26px_21px_26px] mix-blend-hard-light rounded-[34px]" data-name="Blur" />;
}

function Shadow7() {
  return (
    <div className="absolute inset-[-26px]" data-name="Shadow">
      <Mask7 />
      <Blur7 />
    </div>
  );
}

function Fill7() {
  return (
    <div className="absolute inset-0 rounded-[34px]" data-name="Fill">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[34px]">
        <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
        <div className="absolute bg-[rgba(0,0,0,0.04)] inset-0 rounded-[34px]" />
      </div>
    </div>
  );
}

function GlassEffect7() {
  return <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[34px]" data-name="Glass Effect" />;
}

function LiquidGlassRegularLarge7() {
  return (
    <div className="h-[133px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Liquid Glass - Regular - Large">
      <Shadow7 />
      <Fill7 />
      <GlassEffect7 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[18.8%_14.48%_17.29%_14.04%] items-center justify-center">
      <p className="font-['Inter:Black',sans-serif] font-black leading-[normal] not-italic relative shrink-0 text-[22px] text-nowrap text-white whitespace-pre">Chart: Registration → Active → Completed</p>
    </div>
  );
}

function Enroll1() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] h-[119px] items-center justify-center left-[calc(50%+10px)] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.08),0px_4px_4px_0px_rgba(250,250,250,0.7),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[454px] w-[581px]" data-name="enroll">
      <LiquidGlassRegularLarge7 />
      <Frame8 />
      <div className="absolute inset-0 pointer-events-none shadow-[0px_4px_4px_0px_inset_rgba(250,250,250,0.7),0px_4px_4px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Frame12() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[10px] relative w-full">
          <p className="font-['HeliosExt:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Enrollment Process</p>
        </div>
      </div>
    </div>
  );
}

function EnrollTitle1() {
  return (
    <div className="relative shrink-0 w-full" data-name="enroll title">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[10px] relative w-full">
          <Frame12 />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] h-[50px] items-center justify-center left-[calc(50%+4.48px)] pl-[2px] pr-[3px] py-[10px] top-[409px] w-[573.541px]">
      <EnrollTitle1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[49px] top-[401px]">
      <Frame13 />
      <Enroll />
      <Enroll1 />
      <Frame9 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] relative w-full">
          <p className="font-['HeliosExt:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Course Insights</p>
        </div>
      </div>
    </div>
  );
}

function CourseInsights() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] items-start left-[39px] p-[10px] top-[639px] w-[229px]" data-name="Course Insights">
      <Frame15 />
    </div>
  );
}

function Mask8() {
  return (
    <div className="absolute bg-white inset-[-50px]" data-name="Mask">
      <div className="absolute bg-black inset-[76px] rounded-[34px]" data-name="Shape" />
    </div>
  );
}

function Blur8() {
  return <div className="absolute backdrop-blur-2xl backdrop-filter bg-[rgba(255,255,255,0.08)] blur-[20px] filter inset-[31px_26px_21px_26px] mix-blend-hard-light rounded-[34px]" data-name="Blur" />;
}

function Shadow8() {
  return (
    <div className="absolute inset-[-26px]" data-name="Shadow">
      <Mask8 />
      <Blur8 />
    </div>
  );
}

function Fill8() {
  return (
    <div className="absolute inset-0 rounded-[34px]" data-name="Fill">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[34px]">
        <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
        <div className="absolute bg-[rgba(0,0,0,0.04)] inset-0 rounded-[34px]" />
      </div>
    </div>
  );
}

function GlassEffect8() {
  return <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[34px]" data-name="Glass Effect" />;
}

function LiquidGlassRegularLarge8() {
  return (
    <div className="h-[207px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Liquid Glass - Regular - Large">
      <Shadow8 />
      <Fill8 />
      <GlassEffect8 />
      <p className="absolute font-['HeliosExt:Bold',sans-serif] leading-[normal] left-[42px] not-italic text-[20px] text-white top-[43px] w-[320px]">Post Harvest Management</p>
      <p className="absolute font-['HeliosExt:Bold',sans-serif] h-[72px] leading-[normal] left-[42px] not-italic text-[75px] text-white top-[68px] w-[320px]">300</p>
      <p className="absolute font-['HeliosExt:Bold',sans-serif] leading-[normal] left-[42px] not-italic text-[12px] text-white top-[149px] w-[320px]">Enrollments</p>
    </div>
  );
}

function Insights() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] items-start left-[50px] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.08),0px_4px_4px_0px_rgba(250,250,250,0.7),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[684px] w-[580px]" data-name="insights">
      <LiquidGlassRegularLarge8 />
      <div className="absolute inset-0 pointer-events-none shadow-[0px_4px_4px_0px_inset_rgba(250,250,250,0.7),0px_4px_4px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Frame16() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] relative w-full">
          <p className="font-['HeliosExt:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Cold Chain Operation</p>
        </div>
      </div>
    </div>
  );
}

function ColdChainOperation() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] items-start left-[calc(50%+16px)] p-[10px] top-[639px] w-[229px]" data-name="Cold Chain Operation">
      <Frame16 />
    </div>
  );
}

function Mask9() {
  return (
    <div className="absolute bg-white inset-[-50px]" data-name="Mask">
      <div className="absolute bg-black inset-[76px] rounded-[34px]" data-name="Shape" />
    </div>
  );
}

function Blur9() {
  return <div className="absolute backdrop-blur-2xl backdrop-filter bg-[rgba(255,255,255,0.08)] blur-[20px] filter inset-[31px_26px_21px_26px] mix-blend-hard-light rounded-[34px]" data-name="Blur" />;
}

function Shadow9() {
  return (
    <div className="absolute inset-[-26px]" data-name="Shadow">
      <Mask9 />
      <Blur9 />
    </div>
  );
}

function Fill9() {
  return (
    <div className="absolute inset-0 rounded-[34px]" data-name="Fill">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[34px]">
        <div className="absolute bg-[rgba(255,255,255,0.05)] inset-0 mix-blend-color-dodge rounded-[34px]" />
        <div className="absolute bg-[rgba(0,0,0,0.04)] inset-0 rounded-[34px]" />
      </div>
    </div>
  );
}

function GlassEffect9() {
  return <div className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[34px]" data-name="Glass Effect" />;
}

function LiquidGlassRegularLarge9() {
  return (
    <div className="h-[207px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Liquid Glass - Regular - Large">
      <Shadow9 />
      <Fill9 />
      <GlassEffect9 />
      <p className="absolute font-['HeliosExt:Bold',sans-serif] leading-[normal] left-[42px] not-italic text-[20px] text-white top-[43px] w-[320px]">Cold Chain Operation</p>
      <p className="absolute font-['HeliosExt:Bold',sans-serif] h-[72px] leading-[normal] left-[42px] not-italic text-[75px] text-white top-[68px] w-[320px]">150</p>
      <p className="absolute font-['HeliosExt:Bold',sans-serif] leading-[normal] left-[42px] not-italic text-[12px] text-white top-[149px] w-[320px]">Enrollments</p>
    </div>
  );
}

function ColdChainOperation1() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] items-start left-[calc(50%+11px)] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.08),0px_4px_4px_0px_rgba(250,250,250,0.7),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[685px] w-[579px]" data-name="Cold Chain Operation">
      <LiquidGlassRegularLarge9 />
      <div className="absolute inset-0 pointer-events-none shadow-[0px_4px_4px_0px_inset_rgba(250,250,250,0.7),0px_4px_4px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Dashboard() {
  return (
    <div className="absolute h-[92px] left-[50px] top-[61px] w-[504px]" data-name="Dashboard">
      <p className="[text-shadow:rgba(0,0,0,0.25)_0px_4px_4px,rgba(0,0,0,0.25)_0px_4px_4px] absolute bottom-0 font-['HeliosExt:Bold',sans-serif] leading-[normal] not-italic right-[504px] text-[75px] text-white top-0 translate-x-[100%] w-[504px]">Dashboard</p>
    </div>
  );
}

export default function Dashboard1() {
  return (
    <div className="bg-black relative shadow-[0px_4px_4px_0px_rgba(250,250,250,0.7)] size-full" data-name="DASHBOARD">
      <div className="absolute h-[1065px] left-[-180px] top-[-24px] w-[1964px]" data-name="bg">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgBg} />
      </div>
      <div className="absolute h-[356px] left-[-2px] top-[699px] w-[1304px]" data-name="gradient">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[188.69%] left-[-1.55%] max-w-none top-[-88.69%] w-[103.09%]" src={imgGradient} />
        </div>
      </div>
      <NoZoomLogop />
      <Group1 />
      <Component2Default />
      <Frame11 />
      <Frame14 />
      <Group />
      <CourseInsights />
      <Insights />
      <ColdChainOperation />
      <ColdChainOperation1 />
      <Dashboard />
    </div>
  );
}