<template>
 <Suspense>

  <template #default>
      <div>
        <a>annex</a>
      </div>
      </template>

   <template #fallback>
     <span>Loading...</span>
   </template>

 </Suspense>
</template>
