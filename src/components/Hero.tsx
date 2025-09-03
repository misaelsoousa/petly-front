import Navbar from "./Navbar";

export default function Hero (){
    return(
    <>
    <section className="relative">
    <Navbar/>
<div className="after:w-[90%] z-10 after:bg-gradient-to-l after:from-black after:to-transparent after:absolute after:content-[''] after:left-0 after:top-0 after:h-full after:z-20 before:w-[10%] before:bg-black before:absolute before:content-[''] before:right-0 before:top-0 relative before:h-full before:z-20">
  <img src="/img/gato-com-crianca-meio.jpg" alt="" className="max-h-[700px] w-full object-cover z-10" />
</div>
    </section>
    </>        
    )
}