import '@/style/tailwind.css'
import { tw } from './_utility.ts'


//TODO[fortf] README

// @ts-expect-error this object ll never be null
document.querySelector<HTMLDivElement>('#app').innerHTML = ` 
  <div class='${tw`h-screen bg-slate-900`}'>
    <h1 class='${tw`text-white`}'>Hello world!</h1>
  </div>
`
