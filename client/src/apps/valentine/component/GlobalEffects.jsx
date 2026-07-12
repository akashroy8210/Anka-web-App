import FloatingHearts from "./FloatingHeart";
import ParticlesBg from "./ParticlesBg";

function GlobalEffects({ children }) {
  return (
    <>
      <ParticlesBg />
      <FloatingHearts />
      {children}
    </>
  );
}

export default GlobalEffects;
