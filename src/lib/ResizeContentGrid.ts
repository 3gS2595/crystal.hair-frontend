import { storeToRefs } from 'pinia'

import { GlobalStore } from '@/stores/GlobalStore'
import { useKernalStore } from '@/stores/api/KernalStore'

import type { kernalType } from '@/types/ApiTypes'

function resizeContentFit () {
  const min_pane_left =(window.innerWidth < 400) ? 146 : GlobalStore().navWidth
  const cgb_width = GlobalStore().cgbWidth
  const scroll_width = 4
  let cgb_margin = 4.2
  if (GlobalStore().paneSize === 0 ){
    const max_cont_width = window.innerWidth - scroll_width - (cgb_margin + 2)
    const extra_width = max_cont_width % (cgb_width + (cgb_margin))
    const tt = (max_cont_width  - extra_width) / (cgb_width + (cgb_margin))
    GlobalStore().setCgbWidthSized(GlobalStore().cgbWidth + (extra_width / Math.trunc(tt)))
  }
  else {
    const max_cont_width = window.innerWidth - min_pane_left - scroll_width - (cgb_margin)
    let extra_width = max_cont_width % (cgb_width + (cgb_margin)) - 9
    let tt = (max_cont_width  - extra_width) / (cgb_width + (cgb_margin))
    tt = Math.trunc(tt) != 0 ? Math.trunc(tt) : 1
    const content_width_percent = (max_cont_width) / window.innerWidth
    const offset_size = ((-1 * (content_width_percent - 1)) - .55) * 100
    GlobalStore().paneSizeOffSet = (offset_size)
    GlobalStore().setCgbWidthSized(GlobalStore().cgbWidth + (extra_width / tt))
  }
}

function stepContentFit (step: number) {
  const el = document.getElementById('app')
  const cgb_width = GlobalStore().cgbWidth
  let cgb_margin =  4
  let scroll_width = 4
  let min_pane_left =(window.innerWidth < 400) ? 146 : GlobalStore().navWidth
  if ( el != null) {
    const max_cont_width = el.offsetWidth - min_pane_left - scroll_width - (cgb_margin)
    const extra_width = max_cont_width % (cgb_width + (cgb_margin))
    const tt = (max_cont_width  - extra_width) / (cgb_width + (cgb_margin))
    if(step + Math.trunc(tt) >= 1){
      const fitWidth = (max_cont_width - (step + Math.trunc(tt)) * cgb_margin) / (step + Math.trunc(tt))
      GlobalStore().cgbWidth = fitWidth - (GlobalStore().cgbWidthSized - GlobalStore().cgbWidth)
      GlobalStore().cgbWidthSized = fitWidth
      resizeContentFit()
      resizeSrc()
    }
  }
}

function resize (size: number) {
  if (GlobalStore().paneSize !== size) {
    GlobalStore().paneSizeTemp = GlobalStore().paneSize
    GlobalStore().paneSize = size
    GlobalStore().paneSizeOffSet = 0
  } else { GlobalStore().paneSize = GlobalStore().paneSizeTemp }
  resizeContentFit()
}

// SRCSET IMAGE SELECTION ACCORDING TO CARD SIZE
function setSize (k: kernalType) {
  const images = <HTMLCollectionOf<HTMLDivElement>> document.getElementsByClassName('cgb-0');
  if (images[0] !== undefined) {
    const width = images[0].offsetWidth
    if (width > 160 && width <= 400){
      return k.signed_url_m;
    } else if (width > 400 && width <= 1000){
      return k.signed_url_l;
    } else if (width > 1000) {
      return k.signed_url;
    } else {
      return k.signed_url_s;
    }
  } else {
    return k.signed_url_s
  }
}
function resizeSrc() {
  const images = <HTMLCollectionOf<HTMLImageElement>> document.getElementsByClassName('thumbnail');
  const { kernals } = storeToRefs(useKernalStore())
  if (images[0] !== undefined && images[0].parentElement !== null) {
    const width = images[0].offsetWidth
    for(let i = 0; i < images.length; i++) {
      const f: number = kernals.value.findIndex(x => x.id === images[i].id)
      if (width > 160 && width <= 400){
        images[i].setAttribute('src', kernals.value[f].signed_url_m);
      } else if (width > 400 && width <= 1000){
        images[i].setAttribute('src', kernals.value[f].signed_url_l);
      } else if (width > 1000) {
        images[i].setAttribute('src', kernals.value[f].signed_url_l);
      } else {
        images[i].setAttribute('src', kernals.value[f].signed_url_s);
      }
    }
  }
}
function toggleExpand() {
  if ( GlobalStore().paneSize == 35.0) {
    GlobalStore().paneSize = 0.0
    GlobalStore().paneSizeTemp = GlobalStore().paneSizeOffSet
    GlobalStore().paneSizeOffSet = 0.0
  } else {
    GlobalStore().paneSize = 35.0
    GlobalStore().paneSizeOffSet = GlobalStore().paneSizeTemp
  }
  resizeContentFit()
}
function openExpand() {
  GlobalStore().paneSize = 35.0
  GlobalStore().paneSizeOffSet = GlobalStore().paneSizeTemp
  resizeContentFit()
}
function closeExpand() {
  GlobalStore().paneSize = 0.0
  GlobalStore().paneSizeTemp = GlobalStore().paneSizeOffSet
  GlobalStore().paneSizeOffSet = 0.0
  resizeContentFit()
}
export { resize, setSize, stepContentFit, resizeContentFit, toggleExpand, closeExpand, openExpand }

