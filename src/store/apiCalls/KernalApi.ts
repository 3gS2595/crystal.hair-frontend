import { GlobalStore } from '@/store/GlobalStore'
import { ApiStore } from '@/store/ApiStore'
import axios from 'axios'

async function fetchKernals (base: string, config: any, pageNumber: number) {
  const store = GlobalStore()
  const apiStore = ApiStore()
  let params = '?q=' + store.filter + '&page=' + pageNumber + '&sort=' + store.sortBy
  if (store.mixtape != '') { params = params + '&mixtape=' + store.mixtape }
  if (store.srcUrlSubset != '') { params = params + '&src_url_subset_id=' + store.srcUrlSubset }
  try {
    const kernals = await axios.get(base + 'kernals'+ params, config)
    apiStore.kernals = apiStore.kernals.concat(kernals.data)
  } catch (e) {
    console.error(e);
  }
}

