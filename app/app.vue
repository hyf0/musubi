<template>
  <div
    class="min-h-screen flex flex-col bg-[var(--color-canvas-default)] text-[var(--color-fg-default)] transition-colors duration-200"
  >
    <NuxtRouteAnnouncer />
    <Navbar />
    <main class="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>
