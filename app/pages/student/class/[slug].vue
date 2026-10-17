<!-- [slug].vue -->
<template>
  <div
    class="
      relative flex h-screen overflow-hidden
      bg-[#F8F9FD]
      font-['Instrument_Sans','Raleway',sans-serif]
    "
  >
    <!-- Background glow -->
    <div
      class="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="
          absolute -left-[5%] -top-[5%]
          h-[45%] w-[45%]
          rounded-full
          bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
          from-[#443E8D]/[0.06]
          to-transparent
          blur-[120px]
        "
      ></div>

      <div
        class="
          absolute -right-[5%] top-[5%]
          h-[30%] w-[30%]
          rounded-full
          bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]
          from-indigo-400/[0.04]
          to-transparent
          blur-[120px]
        "
      ></div>
    </div>

    <!-- Grid background -->
    <div
      class="
        pointer-events-none fixed inset-0 z-0
        bg-[linear-gradient(to_right,#443E8D06_1px,transparent_1px),linear-gradient(to_bottom,#443E8D06_1px,transparent_1px)]
        bg-[size:80px_80px]
        [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]
      "
      aria-hidden="true"
    ></div>

    <!-- Student sidebar -->
    <StudentSidebar
      :open="sidebarOpen"
      @update:open="sidebarOpen = $event"
    />

    <!-- Main application -->
    <div
      class="
        relative z-10
        flex h-screen min-w-0 flex-1 flex-col
        overflow-hidden
        lg:ml-[210px]
      "
    >
      <!-- Topbar -->
      <header
        class="
          sticky top-0 z-[100]
          flex flex-shrink-0 items-center
          gap-3 border-b border-gray-200
          bg-[#F8F9FD]/90
          px-4 py-3.5
          backdrop-blur-xl
          sm:gap-4 sm:px-6
        "
      >
        <!-- Mobile menu -->
        <button
          class="
            rounded-xl
            border border-gray-200
            p-2
            text-gray-500
            transition-colors
            hover:bg-gray-100
            lg:hidden
          "
          aria-label="Menu"
          @click="sidebarOpen = !sidebarOpen"
        >
          <Bars3Icon class="h-5 w-5" />
        </button>

        <!-- Module info -->
        <div class="min-w-0 flex-1">
          <div class="mb-0.5 flex items-center gap-2">
            <NuxtLink
              to="/student/class"
              class="
                text-[0.625rem]
                font-bold uppercase tracking-widest
                text-gray-400
                transition-colors
                hover:text-[#443E8D]
              "
            >
              Kelas
            </NuxtLink>

            <span class="text-[0.625rem] text-gray-300">
              /
            </span>

            <span
              class="
                max-w-[120px] truncate
                text-[0.625rem]
                font-black uppercase tracking-widest
                text-[#443E8D]
                sm:max-w-[200px]
              "
            >
              {{ moduleData?.title || 'Memuat...' }}
            </span>
          </div>

          <h1
            class="
              flex items-center gap-2
              truncate
              text-sm
              font-bold leading-none
              text-gray-900
              sm:text-[1.0625rem]
            "
          >
            <component
              :is="
                moduleData
                  ? PresentationChartLineIcon
                  : DocumentTextIcon
              "
              class="
                hidden h-4 w-4
                flex-shrink-0
                text-[#443E8D]
                sm:block
              "
            />

            <span class="truncate">
              {{ moduleData?.title || 'Memuat...' }}
            </span>
          </h1>
        </div>

        <!-- Progress -->
        <div
          v-if="moduleData"
          class="
            flex items-center
            gap-3
            border-l border-gray-200
            pl-3
            sm:gap-4 sm:pl-4
          "
        >
          <div class="flex flex-col items-end">
            <span
              class="
                text-[0.55rem]
                font-black uppercase tracking-widest
                text-[#443E8D]
                sm:text-[0.625rem]
              "
            >
              {{ progressPercent }}% Selesai
            </span>

            <div
              class="
                mt-1 h-1.5
                w-16
                overflow-hidden
                rounded-full
                bg-gray-100
                sm:w-24
              "
            >
              <div
                class="
                  h-full
                  bg-gradient-to-r
                  from-[#443E8D]
                  to-indigo-400
                  transition-all
                  duration-1000
                "
                :style="{
                  width: progressPercent + '%'
                }"
              ></div>
            </div>
          </div>
        </div>
      </header>

      <!--
        Mobile fixed navigation

        Fixed di bawah topbar.
        Tidak ikut scroll bersama materi.
      -->
      <div
        v-if="
          moduleData &&
          currentLesson &&
          !isLoading &&
          !errorMsg
        "
        class="
          fixed inset-x-0 top-[67px] z-[90]
          border-b border-gray-200/80
          bg-[#F8F9FD]/95
          px-3 py-2.5
          shadow-[0_6px_24px_rgba(15,23,42,0.06)]
          backdrop-blur-xl
          lg:hidden
        "
      >
        <div
          class="
            mx-auto
            flex max-w-3xl
            items-center gap-2
          "
        >
          <!-- Previous -->
          <button
            class="
              flex h-10 w-10 flex-shrink-0
              items-center justify-center
              rounded-xl
              border border-gray-200
              bg-white
              text-gray-600
              transition-all
              hover:border-[#443E8D]
              hover:text-[#443E8D]
              disabled:pointer-events-none
              disabled:opacity-30
            "
            :disabled="currentLessonIdx === 0"
            aria-label="Sebelumnya"
            @click="prevLesson"
          >
            <ArrowLeftIcon
              class="h-4 w-4 flex-shrink-0"
            />
          </button>

          <!-- Complete -->
          <button
            class="
              flex h-10 min-w-0 flex-[1.25]
              items-center justify-center
              gap-1.5
              rounded-xl
              px-2.5
              text-xs font-bold
              transition-all
            "
            :class="
              isDone
                ? `
                    cursor-default
                    border border-emerald-100
                    bg-emerald-50
                    text-emerald-600
                  `
                : `
                    bg-[#443E8D]
                    text-white
                    shadow-md
                    shadow-indigo-200
                    hover:bg-[#363175]
                  `
            "
            :disabled="isDone"
            @click="markDone"
          >
            <CheckCircleIcon
              class="h-4 w-4 flex-shrink-0"
            />

            <span class="truncate">
              {{
                isDone
                  ? 'Selesai ✓'
                  : 'Tandai Selesai'
              }}
            </span>
          </button>

          <!-- Next -->
          <button
            class="
              flex h-10 w-10 flex-shrink-0
              items-center justify-center
              rounded-xl
              border border-gray-200
              bg-white
              text-gray-600
              transition-all
              hover:border-[#443E8D]
              hover:text-[#443E8D]
              disabled:pointer-events-none
              disabled:opacity-30
            "
            :disabled="
              currentLessonIdx >=
              moduleData.module_lessons.length - 1
            "
            aria-label="Berikutnya"
            @click="nextLesson"
          >
            <ArrowRightIcon
              class="h-4 w-4"
            />
          </button>
        </div>
      </div>

      <!-- Loading module -->
      <div
        v-if="isLoading"
        class="
          flex flex-1
          items-center justify-center
        "
      >
        <div
          class="
            flex flex-col
            items-center gap-4
          "
        >
          <div
            class="
              h-10 w-10
              animate-spin
              rounded-full
              border-[3px]
              border-[#443E8D]/20
              border-t-[#443E8D]
            "
          ></div>

          <p
            class="
              text-sm
              font-medium
              text-gray-400
            "
          >
            Memuat modul...
          </p>
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="errorMsg"
        class="
          flex flex-1 flex-col
          items-center justify-center
          gap-4
          px-5
          text-center
          sm:px-8
        "
      >
        <div
          class="
            flex h-16 w-16
            items-center justify-center
            rounded-2xl
            bg-rose-50
          "
        >
          <ExclamationCircleIcon
            class="h-8 w-8 text-rose-400"
          />
        </div>

        <p
          class="
            text-lg
            font-bold
            text-gray-800
          "
        >
          {{ errorMsg }}
        </p>

        <NuxtLink
          to="/student/class"
          class="
            rounded-xl
            bg-[#443E8D]
            px-6 py-3
            text-sm font-bold
            text-white
            shadow-lg
            shadow-indigo-200
            transition-all
            hover:-translate-y-0.5
          "
        >
          ← Kembali ke Kelas
        </NuxtLink>
      </div>

      <!-- Module content -->
      <div
        v-else-if="
          moduleData &&
          currentLesson
        "
        class="
          flex flex-1
          overflow-hidden
        "
      >
        <!-- Main lesson -->
        <main
          class="
            relative
            min-w-0 flex-1
            overflow-x-hidden
            overflow-y-auto
            scroll-smooth
            bg-white

            px-4
            pb-6
            pt-[82px]

            sm:px-6
            sm:pb-6

            lg:p-12

            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-black/10
            hover:[&::-webkit-scrollbar-thumb]:bg-black/20
          "
        >
          <div
            class="
              mx-auto
              flex min-h-full
              w-full max-w-3xl
              min-w-0
              flex-col
              gap-8
              sm:gap-10
            "
          >
            <!-- Lesson Loading -->
            <div
              v-if="isLessonLoading"
              class="
                flex flex-col
                items-center justify-center
                gap-4
                py-32
              "
            >
              <div
                class="
                  h-8 w-8
                  animate-spin
                  rounded-full
                  border-[3px]
                  border-[#443E8D]/20
                  border-t-[#443E8D]
                "
              ></div>
            </div>

            <template v-else>
              <!-- Lesson Header -->
              <div
                v-if="
                  currentLesson.type !== 'quiz'
                "
                class="
                  flex flex-col
                  gap-3
                  sm:gap-4
                "
              >
                <div
                  class="
                    flex flex-wrap
                    items-center
                    gap-2
                    sm:gap-3
                  "
                >
                  <!-- Type -->
                  <span
                    class="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-xl
                      border
                      px-3 py-1.5
                      text-[0.625rem]
                      font-black
                      uppercase
                      tracking-[0.15em]
                    "
                    :class="
                      lessonTypeStyle(
                        currentLesson.type
                      )
                    "
                  >
                    <component
                      :is="
                        lessonTypeIcon(
                          currentLesson.type
                        )
                      "
                      class="h-3.5 w-3.5"
                    />

                    {{
                      lessonTypeLabel(
                        currentLesson.type
                      )
                    }}
                  </span>

                  <!-- XP -->
                  <span
                    v-if="
                      currentLesson.xp_reward
                    "
                    class="
                      inline-flex
                      items-center
                      gap-1
                      rounded-xl
                      border
                      border-amber-200/60
                      bg-amber-50
                      px-2.5 py-1
                      text-[0.625rem]
                      font-black
                      uppercase
                      tracking-wider
                      text-amber-600
                    "
                  >
                    ⚡ +{{
                      currentLesson.xp_reward
                    }}
                    XP
                  </span>

                  <!-- Number -->
                  <span
                    class="
                      mt-1 w-full
                      text-[0.6rem]
                      font-black
                      uppercase
                      tracking-[0.2em]
                      text-[#443E8D]
                      opacity-60
                      sm:mt-0
                      sm:w-auto
                      sm:text-[0.6875rem]
                    "
                  >
                    Pelajaran
                    {{
                      currentLessonIdx + 1
                    }}
                    dari
                    {{
                      moduleData
                        .module_lessons
                        .length
                    }}
                  </span>
                </div>

                <h2
                  class="
                    break-words
                    text-2xl
                    font-black
                    leading-tight
                    tracking-tight
                    text-gray-900
                    sm:text-3xl
                    lg:text-4xl
                  "
                >
                  {{ currentLesson.title }}
                </h2>
              </div>

              <!-- Video -->
              <div
                v-if="
                  currentLesson.type ===
                    'video' &&
                  lessonDetail?.video_url
                "
                class="
                  group relative
                  aspect-video
                  overflow-hidden
                  rounded-2xl
                  border border-gray-100
                  bg-gray-900
                  shadow-2xl
                  shadow-indigo-100/50
                  sm:rounded-3xl
                "
              >
                <iframe
                  ref="videoIframe"
                  :id="
                    'yt-' +
                    lessonDetail.id
                  "
                  :src="
                    getEmbedUrl(
                      lessonDetail.video_url
                    )
                  "
                  class="
                    relative z-10
                    h-full w-full
                  "
                  allow="
                    accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture
                  "
                  allowfullscreen
                  frameborder="0"
                ></iframe>
              </div>

              <!-- Content renderer -->
              <div
                v-if="
                  currentLesson.type !==
                    'quiz' &&
                  parsedLessonContent
                    .length > 0
                "
                class="
                  flex min-w-0
                  max-w-full
                  flex-col

                  [&_a]:cursor-pointer
                  [&_a]:break-words
                  [&_a]:font-semibold
                  [&_a]:text-[#443E8D]
                  [&_a]:underline
                  [&_a]:decoration-[#443E8D]/40
                  [&_a]:decoration-[1.5px]
                  [&_a]:underline-offset-[3px]
                  [&_a]:transition-all
                  [&_a]:[overflow-wrap:anywhere]

                  [&_a:hover]:rounded
                  [&_a:hover]:bg-[#443E8D]/5
                  [&_a:hover]:text-[#2b2762]
                  [&_a:hover]:decoration-[#2b2762]

                  [&_strong]:font-bold
                  [&_strong]:text-gray-900

                  [&_b]:font-bold
                  [&_b]:text-gray-900

                  [&_em]:italic
                  [&_i]:italic

                  [&_u]:underline
                  [&_u]:underline-offset-[3px]

                  [&_del]:line-through
                  [&_del]:opacity-70

                  [&_s]:line-through
                  [&_s]:opacity-70

                  [&_mark]:rounded
                  [&_mark]:bg-yellow-200
                  [&_mark]:px-1
                  [&_mark]:text-yellow-900
                "
                @click="handleContentClick"
              >
                <template
                  v-for="(
                    block,
                    bi
                  ) in parsedLessonContent"
                  :key="
                    block.id || bi
                  "
                >
                  <!-- H1 -->
                  <h1
                    v-if="
                      block.type ===
                      'heading1'
                    "
                    class="
                      mt-8
                      mb-3
                      break-words
                      border-b
                      border-gray-100
                      pb-2
                      text-2xl
                      font-black
                      leading-tight
                      tracking-tight
                      text-gray-900
                      [overflow-wrap:anywhere]
                      sm:mt-10
                      sm:mb-4
                      sm:pb-3
                      sm:text-3xl
                      lg:text-4xl
                    "
                    v-html="
                      formatRichText(
                        block.content
                      )
                    "
                  ></h1>

                  <!-- H2 -->
                  <h2
                    v-else-if="
                      block.type ===
                      'heading2'
                    "
                    class="
                      mt-7
                      mb-2
                      break-words
                      text-xl
                      font-bold
                      leading-snug
                      tracking-tight
                      text-gray-900
                      [overflow-wrap:anywhere]
                      sm:mt-9
                      sm:mb-3
                      sm:text-2xl
                      lg:text-3xl
                    "
                    v-html="
                      formatRichText(
                        block.content
                      )
                    "
                  ></h2>

                  <!-- H3 -->
                  <h3
                    v-else-if="
                      block.type ===
                      'heading3'
                    "
                    class="
                      mt-5
                      mb-2
                      break-words
                      text-lg
                      font-bold
                      leading-snug
                      tracking-tight
                      text-gray-900
                      [overflow-wrap:anywhere]
                      sm:mt-7
                      sm:text-xl
                      lg:text-2xl
                    "
                    v-html="
                      formatRichText(
                        block.content
                      )
                    "
                  ></h3>

                  <!-- Image -->
                  <div
                    v-else-if="
                      isImageBlock(block)
                    "
                    class="
                      my-5
                      flex min-w-0
                      flex-col
                      items-center
                      sm:my-6
                    "
                  >
                    <div
                      class="
                        group
                        max-w-full
                        overflow-hidden
                        rounded-xl
                        border
                        border-gray-200/70
                        bg-gray-50/50
                        p-2
                        shadow-sm
                        transition-all
                        hover:shadow-md
                        sm:rounded-2xl
                      "
                    >
                      <img
                        :src="
                          getImageUrl(block)
                        "
                        alt="Ilustrasi materi"
                        class="
                          mx-auto
                          h-auto
                          max-h-[400px]
                          max-w-full
                          rounded-lg
                          object-contain
                          sm:max-h-[500px]
                          sm:rounded-xl
                        "
                        loading="lazy"
                      />
                    </div>

                    <span
                      v-if="
                        block.caption
                      "
                      class="
                        mt-2
                        break-words
                        px-4
                        text-center
                        text-[0.65rem]
                        italic
                        text-gray-400
                        [overflow-wrap:anywhere]
                        sm:text-xs
                      "
                      v-html="
                        formatRichText(
                          block.caption
                        )
                      "
                    ></span>
                  </div>

                  <!-- Table -->
                  <div
                    v-else-if="
                      block.type ===
                      'table'
                    "
                    class="
                      my-5
                      max-w-full
                      overflow-x-auto
                      rounded-xl
                      border border-gray-200
                      bg-white
                      shadow-sm

                      [&::-webkit-scrollbar]:h-1.5
                      [&::-webkit-scrollbar-track]:bg-transparent
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb]:bg-black/10

                      sm:my-6
                      sm:rounded-2xl
                    "
                  >
                    <table
                      class="
                        w-full
                        min-w-[500px]
                        border-collapse
                        text-left
                      "
                    >
                      <tbody>
                        <tr
                          v-for="(
                            row,
                            rIdx
                          ) in (
                            block
                              .tableData
                              ?.rows ||
                            block.content ||
                            []
                          )"
                          :key="rIdx"
                          class="
                            border-b
                            border-gray-200
                            transition-colors
                            last:border-0
                            hover:bg-indigo-50/30
                          "
                        >
                          <component
                            :is="
                              block
                                .tableData
                                ?.withHeadings &&
                              rIdx === 0
                                ? 'th'
                                : 'td'
                            "
                            v-for="(
                              cell,
                              cIdx
                            ) in row"
                            :key="cIdx"
                            class="
                              border-r
                              border-gray-200
                              px-4 py-3
                              text-sm
                              leading-relaxed
                              last:border-0
                              sm:px-5
                              sm:py-4
                              sm:text-[0.9375rem]
                            "
                            :class="
                              block
                                .tableData
                                ?.withHeadings &&
                              rIdx === 0
                                ? `
                                    bg-gray-50
                                    font-bold
                                    text-gray-900
                                  `
                                : `
                                    font-normal
                                    text-gray-600
                                  `
                            "
                            v-html="
                              formatRichText(
                                cell
                              )
                            "
                          ></component>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Embed -->
                  <div
                    v-else-if="
                      block.type ===
                      'embed'
                    "
                    class="
                      group
                      my-5
                      flex
                      min-w-0
                      flex-col
                      items-center
                      sm:my-6
                    "
                  >
                    <div
                      class="
                        relative
                        aspect-video
                        w-full
                        overflow-hidden
                        rounded-xl
                        border
                        border-gray-200/80
                        bg-gray-900
                        shadow-md
                        transition-all
                        group-hover:shadow-lg
                        sm:rounded-2xl
                      "
                    >
                      <iframe
                        :src="block.url"
                        class="
                          absolute inset-0
                          h-full w-full
                        "
                        frameborder="0"
                        allowfullscreen
                        allow="
                          accelerometer;
                          autoplay;
                          clipboard-write;
                          encrypted-media;
                          gyroscope;
                          picture-in-picture
                        "
                      ></iframe>
                    </div>

                    <span
                      v-if="
                        block.caption
                      "
                      class="
                        mt-2
                        break-words
                        px-4
                        text-center
                        text-[0.65rem]
                        italic
                        text-gray-400
                        [overflow-wrap:anywhere]
                        sm:text-xs
                      "
                      v-html="
                        formatRichText(
                          block.caption
                        )
                      "
                    ></span>
                  </div>

                  <!-- Empty paragraph -->
                  <div
                    v-else-if="
                      block.type ===
                        'paragraph' &&
                      isEmptyParagraph(
                        block.content
                      )
                    "
                    class="
                      h-2
                      sm:h-3
                    "
                  ></div>

                  <!-- Paragraph -->
                  <p
                    v-else-if="
                      block.type ===
                      'paragraph'
                    "
                    class="
                      mb-3
                      min-w-0
                      max-w-full
                      break-words
                      text-[0.95rem]
                      font-normal
                      leading-relaxed
                      text-gray-600
                      [overflow-wrap:anywhere]
                      sm:text-[1rem]
                      lg:text-[1.0625rem]
                    "
                  >
                    <span
                      class="
                        min-w-0
                        max-w-full
                      "
                      v-html="
                        formatRichText(
                          block.content
                        )
                      "
                    ></span>
                  </p>

                  <!-- Callout -->
                  <div
                    v-else-if="
                      block.type ===
                      'callout'
                    "
                    class="
                      my-4
                      flex min-w-0
                      gap-3
                      rounded-xl
                      border border-indigo-100
                      bg-indigo-50
                      p-4
                      sm:gap-4
                      sm:rounded-2xl
                      sm:p-5
                    "
                  >
                    <span
                      class="
                        flex-shrink-0
                        text-xl
                        sm:text-2xl
                      "
                    >
                      💡
                    </span>

                    <div
                      class="
                        min-w-0
                        flex-1
                        break-words
                        text-sm
                        font-normal
                        leading-relaxed
                        text-[#443E8D]
                        [overflow-wrap:anywhere]
                        sm:text-[0.9375rem]
                      "
                      v-html="
                        formatRichText(
                          block.content
                        )
                      "
                    ></div>
                  </div>

                  <!-- Quote -->
                  <blockquote
                    v-else-if="
                      block.type ===
                      'quote'
                    "
                    class="
                      my-4
                      min-w-0
                      break-words
                      rounded-r-lg
                      border-l-4
                      border-[#443E8D]/40
                      bg-[#443E8D]/[0.03]
                      py-2
                      pl-4 pr-3
                      text-sm
                      leading-relaxed
                      text-gray-500
                      [overflow-wrap:anywhere]
                      sm:pl-5
                      sm:pr-4
                      sm:text-[0.9375rem]
                    "
                    v-html="
                      formatRichText(
                        block.content
                      )
                    "
                  ></blockquote>

                  <!-- Code block -->
                  <div
                    v-else-if="
                      block.type ===
                      'code'
                    "
                    class="
                      relative
                      my-5
                      max-w-full
                      overflow-hidden
                      rounded-xl
                      shadow-xl
                      shadow-gray-900/20
                      ring-1
                      ring-white/5
                      sm:my-7
                      sm:rounded-2xl
                    "
                  >
                    <!-- Code header -->
                    <div
                      class="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-white/[0.06]
                        bg-gradient-to-r
                        from-[#1a1f2e]
                        to-[#1e2436]
                        px-3 py-2.5
                        sm:px-4
                        sm:py-3
                      "
                    >
                      <div
                        class="
                          flex
                          min-w-0
                          items-center
                          gap-1.5
                          sm:gap-2
                        "
                      >
                        <span
                          class="
                            h-2.5 w-2.5
                            flex-shrink-0
                            rounded-full
                            bg-[#FF5F57]
                            shadow-sm
                            shadow-red-500/50
                            sm:h-3
                            sm:w-3
                          "
                        ></span>

                        <span
                          class="
                            h-2.5 w-2.5
                            flex-shrink-0
                            rounded-full
                            bg-[#FEBC2E]
                            shadow-sm
                            shadow-yellow-400/50
                            sm:h-3
                            sm:w-3
                          "
                        ></span>

                        <span
                          class="
                            h-2.5 w-2.5
                            flex-shrink-0
                            rounded-full
                            bg-[#28C840]
                            shadow-sm
                            shadow-green-400/50
                            sm:h-3
                            sm:w-3
                          "
                        ></span>

                        <span
                          class="
                            ml-2
                            truncate
                            font-mono
                            text-[0.55rem]
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-gray-500
                            sm:ml-3
                            sm:text-[0.6rem]
                          "
                        >
                          {{
                            block.language ||
                            'code'
                          }}
                        </span>
                      </div>

                      <!-- Copy -->
                      <button
                        class="
                          ml-2
                          flex flex-shrink-0
                          items-center
                          gap-1
                          rounded-lg
                          px-2.5 py-1
                          text-[0.6rem]
                          font-semibold
                          transition-all
                          duration-200
                          sm:gap-1.5
                          sm:px-3
                          sm:py-1.5
                          sm:text-[0.68rem]
                        "
                        :class="
                          copiedIdx === bi
                            ? `
                                bg-emerald-500/20
                                text-emerald-400
                                ring-1
                                ring-emerald-500/30
                              `
                            : `
                                bg-white/[0.06]
                                text-gray-400
                                ring-1
                                ring-white/[0.08]
                                hover:bg-white/[0.12]
                                hover:text-white
                              `
                        "
                        @click="
                          copyCode(
                            cleanCodeContent(
                              block.content
                            ),
                            bi
                          )
                        "
                      >
                        <svg
                          v-if="
                            copiedIdx === bi
                          "
                          class="
                            h-3 w-3
                            flex-shrink-0
                          "
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2.5"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>

                        <svg
                          v-else
                          class="
                            h-3 w-3
                            flex-shrink-0
                          "
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>

                        {{
                          copiedIdx === bi
                            ? 'Tersalin!'
                            : 'Salin'
                        }}
                      </button>
                    </div>

                    <!-- Code content -->
                    <pre
                      class="
                        m-0
                        max-w-full
                        overflow-x-auto
                        bg-[#161b27]
                        px-4 py-4

                        [&::-webkit-scrollbar]:h-1.5
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-white/10
                        hover:[&::-webkit-scrollbar-thumb]:bg-white/20

                        sm:px-6
                        sm:py-5
                      "
                    ><code
                      class="
                        whitespace-pre
                        font-mono
                        text-xs
                        leading-[1.6]
                        text-[#a8d8a8]
                        sm:text-[0.875rem]
                        sm:leading-[1.75]
                      "
                    >{{ cleanCodeContent(block.content) }}</code></pre>
                  </div>

                  <!-- Divider -->
                  <div
                    v-else-if="
                      block.type ===
                      'divider'
                    "
                    class="
                      my-6
                      sm:my-8
                    "
                  >
                    <hr
                      class="
                        border-0
                        border-t
                        border-gray-200
                      "
                    />
                  </div>

                  <!-- Bookmark -->
                  <a
                    v-else-if="
                      block.type ===
                      'bookmark'
                    "
                    :href="
                      block
                        .bookmarkData
                        ?.url ||
                      block.url
                    "
                    target="_blank"
                    rel="noopener noreferrer"
                    class="
                      group
                      my-4
                      flex min-w-0
                      items-center
                      gap-2
                      rounded-xl
                      border border-gray-200
                      bg-gray-50
                      px-3 py-3
                      no-underline
                      transition-all

                      hover:border-[#443E8D]/30
                      hover:bg-[#443E8D]/[0.03]

                      sm:gap-3
                      sm:px-4
                      sm:py-3.5
                    "
                  >
                    <div
                      class="
                        flex h-8 w-8
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border border-gray-200
                        bg-white
                        text-[#443E8D]
                        shadow-sm
                        sm:h-9
                        sm:w-9
                      "
                    >
                      <svg
                        class="
                          h-3.5 w-3.5
                          sm:h-4
                          sm:w-4
                        "
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>

                    <div
                      class="
                        min-w-0
                        flex-1
                      "
                    >
                      <p
                        class="
                          break-words
                          text-xs
                          font-semibold
                          text-gray-800
                          transition-colors
                          [overflow-wrap:anywhere]
                          group-hover:text-[#443E8D]
                          sm:text-[0.85rem]
                        "
                      >
                        {{
                          block
                            .bookmarkData
                            ?.title ||
                          block
                            .bookmarkData
                            ?.url ||
                          block.url
                        }}
                      </p>

                      <p
                        v-if="
                          block
                            .bookmarkData
                            ?.description
                        "
                        class="
                          mt-0.5
                          break-words
                          text-[0.65rem]
                          text-gray-400
                          [overflow-wrap:anywhere]
                          sm:text-[0.75rem]
                        "
                      >
                        {{
                          block
                            .bookmarkData
                            .description
                        }}
                      </p>
                    </div>

                    <svg
                      class="
                        h-4 w-4
                        flex-shrink-0
                        text-gray-300
                        transition-colors
                        group-hover:text-[#443E8D]
                      "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>

                  <!-- Canva -->
                  <div
                    v-else-if="
                      block.type ===
                      'canva'
                    "
                    class="
                      relative
                      my-5
                      aspect-video
                      w-full
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-200
                      shadow-sm
                      sm:my-6
                    "
                  >
                    <iframe
                      :src="block.url"
                      loading="lazy"
                      allow="fullscreen"
                      allowfullscreen
                      class="
                        absolute inset-0
                        h-full w-full
                        border-0
                      "
                    ></iframe>
                  </div>

                  <!-- Lists -->
                  <component
                    v-else-if="
                      block.type ===
                        'bulletList' ||
                      block.type ===
                        'numberedList'
                    "
                    :is="
                      NestedListRenderer
                    "
                    :items="
                      block.items || []
                    "
                    :isOrdered="
                      block.type ===
                      'numberedList'
                    "
                    :level="1"
                  />
                </template>
              </div>

              <!-- Quiz -->
              <div
                v-else-if="
                  currentLesson.type ===
                  'quiz'
                "
                class="
                  flex flex-col
                  gap-6
                  sm:gap-8
                "
              >
                <div
                  class="
                    flex flex-col
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-8
                    text-center
                    sm:rounded-3xl
                    sm:p-12
                  "
                >
                  <AcademicCapIcon
                    class="
                      h-10 w-10
                      text-gray-300
                    "
                  />

                  <div>
                    <h3
                      class="
                        text-base
                        font-bold
                        text-gray-800
                        sm:text-lg
                      "
                    >
                      Kuis Evaluasi
                    </h3>

                    <p
                      class="
                        mt-1
                        text-xs
                        text-gray-400
                        sm:text-sm
                      "
                    >
                      Kuis akan tampil
                      apabila soal
                      tersedia.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Empty content -->
              <div
                v-else-if="
                  !isLessonLoading &&
                  currentLesson.type !==
                    'video' &&
                  parsedLessonContent
                    .length === 0
                "
                class="
                  flex flex-col
                  items-center
                  justify-center
                  gap-4
                  py-16
                  text-center
                  sm:py-20
                "
              >
                <div
                  class="
                    flex h-14 w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-gray-100
                    bg-gray-50
                    shadow-sm
                    sm:h-16
                    sm:w-16
                    sm:rounded-3xl
                  "
                >
                  <DocumentTextIcon
                    class="
                      h-6 w-6
                      text-gray-300
                      sm:h-8
                      sm:w-8
                    "
                  />
                </div>

                <div>
                  <h3
                    class="
                      text-base
                      font-bold
                      text-gray-700
                      sm:text-lg
                    "
                  >
                    Konten Kosong
                  </h3>

                  <p
                    class="
                      mt-1
                      text-xs
                      text-gray-400
                      sm:text-sm
                    "
                  >
                    Mentor belum
                    menambahkan isi
                    materi.
                  </p>
                </div>
              </div>

              <!-- Desktop navigation -->
              <div
                class="
                  mt-auto
                  hidden
                  items-center
                  justify-between
                  gap-4
                  border-t
                  border-gray-100
                  pt-10
                  lg:flex
                "
              >
                <!-- Previous -->
                <button
                  class="
                    group
                    flex items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-gray-200
                    px-5 py-2.5
                    text-sm
                    font-bold
                    text-gray-600
                    transition-all
                    hover:border-[#443E8D]
                    hover:text-[#443E8D]
                    disabled:pointer-events-none
                    disabled:opacity-30
                  "
                  :disabled="
                    currentLessonIdx === 0
                  "
                  @click="prevLesson"
                >
                  <ArrowLeftIcon
                    class="
                      h-4 w-4
                      transition-transform
                      group-hover:-translate-x-1
                    "
                  />

                  Sebelumnya
                </button>

                <!-- Complete -->
                <button
                  class="
                    flex items-center
                    justify-center
                    gap-2
                    rounded-xl
                    px-6 py-2.5
                    text-sm
                    font-bold
                    shadow-md
                    transition-all
                  "
                  :class="
                    isDone
                      ? `
                          cursor-default
                          border
                          border-emerald-100
                          bg-emerald-50
                          text-emerald-600
                          opacity-80
                        `
                      : `
                          cursor-pointer
                          bg-[#443E8D]
                          text-white
                          shadow-indigo-200
                          hover:bg-[#363175]
                        `
                  "
                  :disabled="isDone"
                  @click="markDone"
                >
                  <CheckCircleIcon
                    class="h-4 w-4"
                  />

                  {{
                    isDone
                      ? 'Sudah Selesai ✓'
                      : 'Tandai Selesai'
                  }}
                </button>

                <!-- Next -->
                <button
                  class="
                    group
                    flex items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-gray-200
                    px-5 py-2.5
                    text-sm
                    font-bold
                    text-gray-600
                    transition-all
                    hover:border-[#443E8D]
                    hover:text-[#443E8D]
                    disabled:pointer-events-none
                    disabled:opacity-30
                  "
                  :disabled="
                    currentLessonIdx >=
                    moduleData
                      .module_lessons
                      .length -
                      1
                  "
                  @click="nextLesson"
                >
                  Berikutnya

                  <ArrowRightIcon
                    class="
                      h-4 w-4
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </button>
              </div>
            </template>
          </div>
        </main>

        <!-- Right Sidebar -->
        <aside
          class="
            relative z-10
            hidden w-72
            flex-shrink-0
            flex-col
            overflow-hidden
            border-l
            border-gray-200
            bg-white
            xl:flex
          "
        >
          <!-- Sidebar Header -->
          <div
            class="
              flex-shrink-0
              border-b
              border-gray-100
              px-5 py-4
            "
          >
            <p
              class="
                text-[0.625rem]
                font-black
                uppercase
                tracking-[0.18em]
                text-gray-400
              "
            >
              Daftar Pelajaran
            </p>

            <p
              class="
                mt-0.5
                text-[0.75rem]
                font-semibold
                text-gray-700
              "
            >
              {{ completedCount }}
              /
              {{
                moduleData
                  ?.module_lessons
                  ?.length ?? 0
              }}
              selesai
            </p>

            <div
              class="
                mt-2.5
                h-1.5
                overflow-hidden
                rounded-full
                bg-gray-100
              "
            >
              <div
                class="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-[#443E8D]
                  to-indigo-400
                  transition-all
                  duration-700
                "
                :style="{
                  width:
                    progressPercent +
                    '%'
                }"
              ></div>
            </div>
          </div>

          <!-- Lesson list -->
          <div
            class="
              flex-1
              overflow-y-auto
              py-2

              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-black/5
              hover:[&::-webkit-scrollbar-thumb]:bg-black/10
            "
          >
            <button
              v-for="(
                lesson,
                idx
              ) in moduleData
                ?.module_lessons ?? []"
              :key="lesson.id"
              class="
                group relative
                flex w-full
                items-start
                gap-3
                px-4 py-3
                text-left
                transition-all
                hover:bg-gray-50
              "
              :class="
                idx ===
                currentLessonIdx
                  ? 'bg-[#443E8D]/[0.05]'
                  : ''
              "
              @click="
                goToLesson(idx)
              "
            >
              <!-- Active indicator -->
              <div
                v-if="
                  idx ===
                  currentLessonIdx
                "
                class="
                  absolute
                  bottom-2
                  left-0
                  top-2
                  w-0.5
                  rounded-r-full
                  bg-[#443E8D]
                "
              ></div>

              <!-- State Icon -->
              <div
                class="
                  mt-0.5
                  flex h-6 w-6
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  transition-colors
                "
                :class="
                  doneSet.has(
                    lesson.id
                  )
                    ? `
                        border-emerald-500
                        bg-emerald-500
                        text-white
                      `
                    : idx ===
                        currentLessonIdx
                      ? `
                          border-[#443E8D]
                          bg-[#443E8D]/10
                        `
                      : `
                          border-gray-200
                          bg-gray-50
                        `
                "
              >
                <CheckCircleIcon
                  v-if="
                    doneSet.has(
                      lesson.id
                    )
                  "
                  class="
                    h-3.5 w-3.5
                  "
                />

                <span
                  v-else-if="
                    idx ===
                    currentLessonIdx
                  "
                  class="
                    h-2 w-2
                    rounded-full
                    bg-[#443E8D]
                  "
                ></span>

                <span
                  v-else
                  class="
                    h-1.5 w-1.5
                    rounded-full
                    bg-gray-300
                  "
                ></span>
              </div>

              <!-- Lesson -->
              <div
                class="
                  min-w-0
                  flex-1
                "
              >
                <p
                  class="
                    break-words
                    text-[0.8rem]
                    font-medium
                    leading-snug
                    transition-colors
                    [overflow-wrap:anywhere]
                  "
                  :class="
                    idx ===
                    currentLessonIdx
                      ? `
                          font-semibold
                          text-[#443E8D]
                        `
                      : doneSet.has(
                            lesson.id
                          )
                        ? `
                            text-gray-400
                            line-through
                          `
                        : `
                            text-gray-700
                            group-hover:text-gray-900
                          `
                  "
                >
                  {{ lesson.title }}
                </p>

                <div
                  class="
                    mt-1
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <component
                    :is="
                      lessonTypeIcon(
                        lesson.type
                      )
                    "
                    class="
                      h-3 w-3
                      flex-shrink-0
                    "
                    :class="
                      idx ===
                      currentLessonIdx
                        ? 'text-[#443E8D]'
                        : 'text-gray-300'
                    "
                  />

                  <span
                    class="
                      text-[0.65rem]
                      capitalize
                    "
                    :class="
                      idx ===
                      currentLessonIdx
                        ? 'text-[#443E8D]'
                        : 'text-gray-400'
                    "
                  >
                    {{
                      lessonTypeLabel(
                        lesson.type
                      )
                    }}
                  </span>

                  <span
                    v-if="
                      lesson.xp_reward
                    "
                    class="
                      text-[0.6rem]
                      font-semibold
                      text-amber-500
                    "
                  >
                    · +{{
                      lesson.xp_reward
                    }}
                    XP
                  </span>
                </div>
              </div>

              <span
                class="
                  mt-1
                  flex-shrink-0
                  text-[0.625rem]
                  font-bold
                  text-gray-300
                "
              >
                {{ idx + 1 }}
              </span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  nextTick,
  h
} from 'vue'

import StudentSidebar from '~/components/student/StudentSidebar.vue'

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  ExclamationCircleIcon,
  PresentationChartLineIcon
} from '@heroicons/vue/24/outline'

/* =========================================================
 * Route / Page
 * ======================================================= */

const route = useRoute()

const slug = computed(
  () =>
    route.params.slug as string
)

useSeoMeta({
  title:
    'Class Module — Pixelnoid Academy'
})

definePageMeta({
  layout: 'dashboard'
})

/* =========================================================
 * Supabase
 * ======================================================= */

const supabase =
  useSupabaseClient()

/* =========================================================
 * Interfaces
 * ======================================================= */

interface LessonMeta {
  id: number
  title: string
  slug: string
  type: string
  sort_order: number
  video_url?: string | null
  xp_reward?: number | null
  progress_status?: string
}

interface LessonDetail {
  id: number
  title: string
  slug: string
  type: string
  video_url: string | null
  xp_reward?: number | null
  content:
    | ContentBlock[]
    | string
    | null
  progress_status?: string
}

interface BookmarkData {
  url?: string
  title?: string
  description?: string
}

interface TableData {
  rows: string[][]
  colWidths?: number[]
  withHeadings?: boolean
}

interface ContentBlock {
  id?: string

  type: string

  content?:
    | string
    | any[]

  url?: string

  caption?: string

  items?: any[]

  language?: string

  bookmarkData?: BookmarkData

  tableData?:
    | TableData
    | any

  withHeadings?: boolean

  embedService?: string
}

interface ModuleData {
  id: number
  title: string
  slug: string

  description:
    | string
    | null

  xp_reward:
    | number
    | null

  estimated_minutes:
    | number
    | null

  class_id: number

  module_lessons:
    LessonMeta[]
}

/* =========================================================
 * State
 * ======================================================= */

const sidebarOpen =
  ref(false)

const moduleData =
  ref<ModuleData | null>(
    null
  )

const lessonDetail =
  ref<LessonDetail | null>(
    null
  )

const isLoading =
  ref(true)

const isLessonLoading =
  ref(false)

const errorMsg =
  ref('')

const currentLessonIdx =
  ref(0)

const doneSet =
  ref(
    new Set<number>()
  )

const copiedIdx =
  ref<number | null>(
    null
  )

const videoIframe =
  ref<HTMLElement | null>(
    null
  )

let ytPlayer: any = null

const lessonCache =
  new Map<
    number,
    LessonDetail
  >()

/* =========================================================
 * List helpers
 * ======================================================= */

function getItemHtml(
  item: any
): string {
  if (
    typeof item ===
    'string'
  ) {
    return item
  }

  if (
    item &&
    typeof item ===
      'object'
  ) {
    return (
      item.content ||
      item.text ||
      ''
    )
  }

  return ''
}

function getSubItems(
  item: any
): any[] {
  if (
    typeof item ===
      'object' &&
    Array.isArray(
      item?.items
    )
  ) {
    return item.items
  }

  return []
}

/* =========================================================
 * Rich text formatter
 * ======================================================= */

function formatRichText(
  content: any
): string {
  if (
    content === null ||
    content === undefined
  ) {
    return ''
  }

  let text =
    typeof content ===
    'string'
      ? content
      : String(content)

  if (!text) {
    return ''
  }

  /*
   * Remove escaped Markdown characters
   */
  text =
    text.replace(
      /\\([.[\]()*_`~#+!\\-])/g,
      '$1'
    )

  /*
   * Decode ampersand
   */
  text =
    text.replace(
      /&amp;/g,
      '&'
    )

  /*
   * Inline code
   *
   * whitespace-normal +
   * overflow-wrap:anywhere
   * membuat path panjang dapat
   * turun baris di mobile.
   */
  text =
    text.replace(
      /`([^`]+)`/g,
      `
        <code
          class="
            max-w-full
            whitespace-normal
            break-words
            [overflow-wrap:anywhere]
            rounded-md
            border
            border-[#DCE0EF]
            bg-[#F1F3F9]
            px-1.5
            py-0.5
            font-mono
            text-[0.85em]
            font-semibold
            leading-relaxed
            text-[#363175]
          "
        >$1</code>
      `
    )

  /*
   * Bold
   */
  text =
    text.replace(
      /\*\*(.+?)\*\*/g,
      '<strong>$1</strong>'
    )

  text =
    text.replace(
      /__(.+?)__/g,
      '<strong>$1</strong>'
    )

  /*
   * Italic
   */
  text =
    text.replace(
      /(^|[^*])\*([^*]+?)\*([^*]|$)/g,
      '$1<em>$2</em>$3'
    )

  text =
    text.replace(
      /(^|[^a-zA-Z0-9_])_([^_]+?)_([^a-zA-Z0-9_]|$)/g,
      '$1<em>$2</em>$3'
    )

  /*
   * Strikethrough
   */
  text =
    text.replace(
      /~~(.+?)~~/g,
      '<del>$1</del>'
    )

  /*
   * Markdown Link
   */
  text =
    text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )

  /*
   * Force HTML links to new tab
   */
  text =
    text.replace(
      /<a\b([^>]*)>/gi,
      (
        match,
        attrs
      ) => {
        let newAttrs =
          attrs

        if (
          /target\s*=/i.test(
            newAttrs
          )
        ) {
          newAttrs =
            newAttrs.replace(
              /target\s*=\s*["'][^"']*["']/gi,
              'target="_blank"'
            )
        } else {
          newAttrs +=
            ' target="_blank"'
        }

        if (
          /rel\s*=/i.test(
            newAttrs
          )
        ) {
          newAttrs =
            newAttrs.replace(
              /rel\s*=\s*["'][^"']*["']/gi,
              'rel="noopener noreferrer"'
            )
        } else {
          newAttrs +=
            ' rel="noopener noreferrer"'
        }

        return `<a${newAttrs}>`
      }
    )

  return text
}

/* =========================================================
 * Paragraph helper
 * ======================================================= */

function isEmptyParagraph(
  content: any
): boolean {
  if (
    content === null ||
    content === undefined
  ) {
    return true
  }

  if (
    typeof content !==
    'string'
  ) {
    return false
  }

  const value =
    content.trim()

  return (
    value === '' ||
    value === '<br>' ||
    value === '<br/>'
  )
}

/* =========================================================
 * Code Helpers
 * ======================================================= */

function cleanCodeContent(
  code: any
): string {
  if (!code) {
    return ''
  }

  if (
    typeof code !==
    'string'
  ) {
    return String(code)
  }

  return code.replace(
    /\\(\[|\])/g,
    '$1'
  )
}

async function copyCode(
  content:
    | string
    | undefined,
  idx: number
) {
  if (!content) {
    return
  }

  try {
    await navigator
      .clipboard
      .writeText(content)

    copiedIdx.value =
      idx

    setTimeout(() => {
      copiedIdx.value =
        null
    }, 2000)
  } catch (error) {
    console.error(
      'Copy failed:',
      error
    )
  }
}

/* =========================================================
 * Handle content click
 * ======================================================= */

function handleContentClick(
  event: MouseEvent
) {
  const target =
    (
      event.target as HTMLElement
    )?.closest('a')

  if (!target) {
    return
  }

  const href =
    target.getAttribute(
      'href'
    )

  if (!href) {
    return
  }

  if (
    href.startsWith(
      'http://'
    ) ||
    href.startsWith(
      'https://'
    ) ||
    href.startsWith('//')
  ) {
    target.setAttribute(
      'target',
      '_blank'
    )

    target.setAttribute(
      'rel',
      'noopener noreferrer'
    )
  }
}

/* =========================================================
 * Nested list renderer
 * ======================================================= */

const NestedListRenderer = (
  props: {
    items: any[]
    isOrdered: boolean
    level: number
  }
): any => {
  if (
    !props.items ||
    props.items.length ===
      0
  ) {
    return null
  }

  const isTopLevel =
    props.level === 1

  return h(
    props.isOrdered
      ? 'ol'
      : 'ul',
    {
      class:
        isTopLevel
          ? `
              my-4
              flex
              min-w-0
              max-w-full
              flex-col
              gap-3
              pl-2
            `
          : `
              mt-2
              flex
              min-w-0
              max-w-full
              flex-col
              gap-2
              pl-6
            `
    },

    props.items.map(
      (
        item: any,
        index: number
      ) => {
        const rawHtml =
          getItemHtml(item)

        const html =
          formatRichText(
            rawHtml
          )

        const subItems =
          getSubItems(item)

        const contentNode =
          h(
            'span',
            {
              class: `
                min-w-0
                max-w-full
                flex-1
                break-words
                text-[1rem]
                font-normal
                leading-relaxed
                text-gray-600
                [overflow-wrap:anywhere]
              `,
              innerHTML:
                html
            }
          )

        let itemContent

        if (isTopLevel) {
          itemContent =
            h(
              'div',
              {
                class: `
                  flex
                  min-w-0
                  max-w-full
                  items-start
                  gap-3
                `
              },

              [
                props.isOrdered
                  ? h(
                      'span',
                      {
                        class: `
                          mt-0.5
                          flex
                          h-5
                          w-5
                          flex-shrink-0
                          items-center
                          justify-center
                          rounded-md
                          border
                          border-[#443E8D]/20
                          bg-[#443E8D]/10
                          text-[0.7rem]
                          font-black
                          text-[#443E8D]
                        `
                      },
                      String(
                        index +
                          1
                      )
                    )

                  : h(
                      'span',
                      {
                        class: `
                          mt-[0.55rem]
                          h-1.5
                          w-1.5
                          flex-shrink-0
                          rounded-full
                          bg-[#443E8D]
                        `
                      }
                    ),

                contentNode
              ]
            )
        } else {
          itemContent =
            h(
              'div',
              {
                class: `
                  flex
                  min-w-0
                  max-w-full
                  items-start
                  gap-2
                `
              },

              [
                props.isOrdered
                  ? h(
                      'span',
                      {
                        class: `
                          mt-0.5
                          min-w-[1rem]
                          flex-shrink-0
                          text-[0.75rem]
                          font-bold
                          text-[#443E8D]
                        `
                      },
                      `${
                        index +
                        1
                      }.`
                    )

                  : h(
                      'span',
                      {
                        class: `
                          mt-[0.55rem]
                          h-1
                          w-1
                          flex-shrink-0
                          rounded-full
                          bg-gray-400
                        `
                      }
                    ),

                h(
                  'span',
                  {
                    class: `
                      min-w-0
                      max-w-full
                      flex-1
                      break-words
                      text-[0.9375rem]
                      font-normal
                      leading-relaxed
                      text-gray-600
                      [overflow-wrap:anywhere]
                    `,
                    innerHTML:
                      html
                  }
                )
              ]
            )
        }

        return h(
          'li',
          {
            class: `
              min-w-0
              max-w-full
              list-none
            `
          },
          [
            itemContent,

            subItems.length >
            0
              ? h(
                  NestedListRenderer,
                  {
                    items:
                      subItems,

                    isOrdered:
                      props.isOrdered,

                    level:
                      props.level +
                      1
                  }
                )
              : null
          ]
        )
      }
    )
  )
}

/* =========================================================
 * Computed
 * ======================================================= */

const currentLesson =
  computed(() => {
    return (
      moduleData
        .value
        ?.module_lessons[
          currentLessonIdx
            .value
        ] ?? null
    )
  })

const completedCount =
  computed(
    () =>
      doneSet.value
        .size
  )

const progressPercent =
  computed(() => {
    if (
      !moduleData.value ||
      moduleData.value
        .module_lessons
        .length === 0
    ) {
      return 0
    }

    return Math.round(
      (
        completedCount
          .value /
        moduleData.value
          .module_lessons
          .length
      ) *
        100
    )
  })

const isDone =
  computed(() => {
    if (
      !currentLesson.value
    ) {
      return false
    }

    return doneSet.value.has(
      currentLesson.value
        .id
    )
  })

const parsedLessonContent =
  computed<
    ContentBlock[]
  >(() => {
    if (
      !lessonDetail.value
        ?.content
    ) {
      return []
    }

    let raw =
      lessonDetail.value
        .content

    if (
      typeof raw ===
      'string'
    ) {
      try {
        raw =
          JSON.parse(raw)
      } catch {
        return []
      }
    }

    return Array.isArray(
      raw
    )
      ? raw
      : []
  })

/* =========================================================
 * Lesson type helpers
 * ======================================================= */

function lessonTypeIcon(
  type: string
) {
  const map:
    Record<
      string,
      any
    > = {
    video:
      VideoCameraIcon,

    text:
      DocumentTextIcon,

    quiz:
      AcademicCapIcon,

    task:
      ClipboardDocumentListIcon
  }

  return (
    map[type] ??
    DocumentTextIcon
  )
}

function lessonTypeLabel(
  type: string
) {
  const map:
    Record<
      string,
      string
    > = {
    video: 'Video',
    text: 'Materi',
    quiz: 'Quiz',
    task: 'Tugas'
  }

  return (
    map[type] ??
    type
  )
}

function lessonTypeStyle(
  type: string
) {
  const map:
    Record<
      string,
      string
    > = {
    video:
      'bg-rose-50 text-rose-600 border-rose-100',

    text:
      'bg-emerald-50 text-emerald-700 border-emerald-100',

    quiz:
      'bg-amber-50 text-amber-700 border-amber-100',

    task:
      'bg-blue-50 text-blue-700 border-blue-100'
  }

  return (
    map[type] ??
    'bg-gray-50 text-gray-600 border-gray-100'
  )
}

/* =========================================================
 * YouTube
 * ======================================================= */

function extractYouTubeId(
  url: string
) {
  if (!url) {
    return null
  }

  const match =
    url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\s?/]+)/
    )

  return match
    ? match[1]
    : null
}

function getEmbedUrl(
  url: string
) {
  if (!url) {
    return ''
  }

  const youtubeId =
    extractYouTubeId(
      url
    )

  if (youtubeId) {
    return (
      `https://www.youtube.com/embed/${youtubeId}` +
      '?rel=0' +
      '&modestbranding=1' +
      '&enablejsapi=1'
    )
  }

  return url
}

function initYouTubePlayer(
  url: string
) {
  const videoId =
    extractYouTubeId(
      url
    )

  if (!videoId) {
    return
  }

  function createYT() {
    nextTick(() => {
      const element =
        document
          .getElementById(
            `yt-${
              lessonDetail
                .value
                ?.id ?? ''
            }`
          )

      if (!element) {
        return
      }

      try {
        if (
          ytPlayer
            ?.destroy
        ) {
          ytPlayer.destroy()
        }

        ytPlayer =
          new (
            window as any
          ).YT.Player(
            element,
            {
              events: {
                onStateChange:
                  (
                    event:
                      any
                  ) => {
                    const YT =
                      (
                        window as any
                      ).YT

                    if (
                      event.data ===
                        YT
                          .PlayerState
                          .ENDED &&
                      currentLesson
                        .value
                    ) {
                      const id =
                        currentLesson
                          .value
                          .id

                      markLessonCompleted(
                        id
                      )

                      doneSet
                        .value
                        .add(
                          id
                        )
                    }
                  }
              }
            }
          )
      } catch (
        error
      ) {
        console.error(
          'YouTube player error:',
          error
        )
      }
    })
  }

  if (
    (
      window as any
    ).YT &&
    (
      window as any
    ).YT.Player
  ) {
    createYT()

    return
  }

  const existingScript =
    document
      .querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )

  if (
    !existingScript
  ) {
    const script =
      document
        .createElement(
          'script'
        )

    script.src =
      'https://www.youtube.com/iframe_api'

    document.head
      .appendChild(
        script
      )
  }

  const previousCallback =
    (
      window as any
    )
      .onYouTubeIframeAPIReady

  ;(
    window as any
  )
    .onYouTubeIframeAPIReady =
    () => {
      if (
        typeof previousCallback ===
        'function'
      ) {
        previousCallback()
      }

      createYT()
    }
}

/* =========================================================
 * Images
 * ======================================================= */

function isImageBlock(
  block: ContentBlock
) {
  if (!block) {
    return false
  }

  if (
    block.type ===
    'image'
  ) {
    return true
  }

  if (
    block.type ===
      'paragraph' &&
    typeof block.content ===
      'string'
  ) {
    const content =
      block.content
        .trim()

    return (
      /^\[Image:\s*(.+?)\]$/i.test(
        content
      ) ||
      /^!\[.*?\]\((.+?)\)$/i.test(
        content
      ) ||
      /^https?:\/\/\S+\.(?:png|jpe?g|gif|webp|svg|bmp)(?:\?\S*)?$/i.test(
        content
      )
    )
  }

  return false
}

function getImageUrl(
  block: ContentBlock
) {
  if (!block) {
    return ''
  }

  let raw = ''

  if (
    block.type ===
    'image'
  ) {
    raw =
      typeof block.content ===
      'string'
        ? block.content
        : block.url ||
          ''
  } else if (
    typeof block.content ===
    'string'
  ) {
    const content =
      block.content
        .trim()

    const customImage =
      content.match(
        /^\[Image:\s*(.+?)\]$/i
      )

    if (
      customImage
    ) {
      raw =
        customImage[1]
    } else {
      const markdownImage =
        content.match(
          /^!\[.*?\]\((.+?)\)$/i
        )

      raw =
        markdownImage
          ? markdownImage[
              1
            ]
          : content
    }
  }

  return raw
    .replace(
      /&amp;/g,
      '&'
    )
    .trim()
}

/* =========================================================
 * Auth token
 * ======================================================= */

async function getValidToken():
  Promise<
    string | null
  > {
  try {
    const {
      data: {
        session
      }
    } =
      await supabase.auth
        .getSession()

    if (
      session
        ?.access_token
    ) {
      return session
        .access_token
    }

    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          250
        )
    )

    const {
      data:
        retryData
    } =
      await supabase.auth
        .getSession()

    if (
      retryData
        ?.session
        ?.access_token
    ) {
      return (
        retryData
          .session
          .access_token
      )
    }

    const {
      data:
        refreshData
    } =
      await supabase.auth
        .refreshSession()

    return (
      refreshData
        ?.session
        ?.access_token ||
      null
    )
  } catch {
    return null
  }
}

/* =========================================================
 * Progress
 * ======================================================= */

async function markLessonCompleted(
  lessonId: number
) {
  if (!lessonId) {
    return
  }

  try {
    const token =
      await getValidToken()

    if (!token) {
      return
    }

    await $fetch(
      '/api/student/lessons/update-progress',
      {
        method:
          'POST',

        headers: {
          Authorization:
            `Bearer ${token}`
        },

        body: {
          lesson_id:
            lessonId,

          status:
            'completed'
        }
      }
    )
  } catch (
    error
  ) {
    console.error(
      'Failed to update lesson progress:',
      error
    )
  }
}

/* =========================================================
 * Prefetch
 * ======================================================= */

function prefetchNextLesson() {
  const nextMeta =
    moduleData
      .value
      ?.module_lessons[
        currentLessonIdx
          .value +
          1
      ]

  if (
    !nextMeta ||
    lessonCache.has(
      nextMeta.id
    )
  ) {
    return
  }

  getValidToken()
    .then(
      token => {
        if (!token) {
          return
        }

        return $fetch<{
          lesson:
            LessonDetail
        }>(
          `/api/student/lessons/${nextMeta.id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )
      }
    )
    .then(
      data => {
        if (
          !data?.lesson
        ) {
          return
        }

        if (
          typeof data
            .lesson
            .content ===
          'string'
        ) {
          try {
            data.lesson
              .content =
              JSON.parse(
                data.lesson
                  .content
              )
          } catch {
            // Keep original
          }
        }

        lessonCache.set(
          nextMeta.id,
          data.lesson
        )
      }
    )
    .catch(
      () => {}
    )
}

/* =========================================================
 * Fetch Module
 * ======================================================= */

async function fetchModule() {
  isLoading.value =
    true

  errorMsg.value =
    ''

  try {
    const token =
      await getValidToken()

    if (!token) {
      errorMsg.value =
        'Sesi tidak ditemukan. Silakan login ulang.'

      return
    }

    const data =
      await $fetch<{
        module:
          ModuleData

        initial_lesson?:
          LessonDetail
      }>(
        `/api/student/modules/${slug.value}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )

    moduleData.value =
      data.module

    /*
     * Load completed lessons
     */
    const completedLessons =
      (
        data.module
          .module_lessons ||
        []
      )
        .filter(
          lesson =>
            lesson
              .progress_status ===
            'completed'
        )
        .map(
          lesson =>
            lesson.id
        )

    doneSet.value =
      new Set(
        completedLessons
      )

    /*
     * Initial lesson
     */
    if (
      data.initial_lesson
    ) {
      lessonDetail.value =
        data.initial_lesson

      if (
        typeof data
          .initial_lesson
          .content ===
        'string'
      ) {
        try {
          data.initial_lesson
            .content =
            JSON.parse(
              data
                .initial_lesson
                .content
            )
        } catch {
          // Ignore invalid JSON
        }
      }

      lessonCache.set(
        data
          .initial_lesson
          .id,

        data
          .initial_lesson
      )

      const foundIdx =
        (
          data.module
            .module_lessons ||
          []
        ).findIndex(
          lesson =>
            lesson.id ===
            data
              .initial_lesson!
              .id
        )

      if (
        foundIdx >= 0
      ) {
        currentLessonIdx
          .value =
          foundIdx
      }

      if (
        data
          .initial_lesson
          .progress_status ===
        'completed'
      ) {
        doneSet.value.add(
          data
            .initial_lesson
            .id
        )
      }

      if (
        data
          .initial_lesson
          .type ===
          'video' &&
        data
          .initial_lesson
          .video_url
      ) {
        initYouTubePlayer(
          data
            .initial_lesson
            .video_url
        )
      }

      isLessonLoading
        .value =
        false
    } else {
      const firstLessonId =
        Number(
          data.module
            ?.module_lessons
            ?.[0]
            ?.id ??
            0
        )

      if (
        firstLessonId >
        0
      ) {
        await fetchLessonDetail(
          firstLessonId
        )
      }
    }

    useSeoMeta({
      title:
        `${data.module.title} — Pixelnoid Academy`
    })

    prefetchNextLesson()
  } catch (
    error: any
  ) {
    errorMsg.value =
      error
        ?.data
        ?.statusMessage ||
      error
        ?.message ||
      'Gagal memuat modul.'
  } finally {
    isLoading.value =
      false
  }
}

/* =========================================================
 * Fetch Lesson
 * ======================================================= */

async function fetchLessonDetail(
  lessonId: number
) {
  /*
   * Use cache
   */
  if (
    lessonCache.has(
      lessonId
    )
  ) {
    lessonDetail.value =
      lessonCache.get(
        lessonId
      )!

    isLessonLoading
      .value =
      false

    if (
      lessonDetail
        .value
        .progress_status ===
      'completed'
    ) {
      doneSet.value.add(
        lessonDetail
          .value
          .id
      )
    }

    if (
      lessonDetail
        .value
        .type ===
        'video' &&
      lessonDetail
        .value
        .video_url
    ) {
      initYouTubePlayer(
        lessonDetail
          .value
          .video_url
      )
    }

    prefetchNextLesson()

    return
  }

  /*
   * Fetch API
   */
  isLessonLoading
    .value =
    true

  lessonDetail.value =
    null

  try {
    const token =
      await getValidToken()

    if (!token) {
      return
    }

    const data =
      await $fetch<{
        lesson:
          LessonDetail
      }>(
        `/api/student/lessons/${lessonId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )

    lessonDetail.value =
      data.lesson

    if (
      typeof lessonDetail
        .value
        ?.content ===
      'string'
    ) {
      try {
        lessonDetail
          .value
          .content =
          JSON.parse(
            lessonDetail
              .value
              .content
          )
      } catch {
        // Ignore invalid JSON
      }
    }

    lessonCache.set(
      lessonId,
      lessonDetail.value
    )

    if (
      lessonDetail
        .value
        .progress_status ===
      'completed'
    ) {
      doneSet.value.add(
        lessonDetail
          .value
          .id
      )
    }

    if (
      lessonDetail
        .value
        .type ===
        'video' &&
      lessonDetail
        .value
        .video_url
    ) {
      initYouTubePlayer(
        lessonDetail
          .value
          .video_url
      )
    }

    prefetchNextLesson()
  } catch (
    error
  ) {
    console.error(
      'Failed to fetch lesson:',
      error
    )
  } finally {
    isLessonLoading
      .value =
      false
  }
}

/* =========================================================
 * Navigation
 * ======================================================= */

async function goToLesson(
  index: number
) {
  const lesson =
    moduleData
      .value
      ?.module_lessons[
        index
      ]

  if (!lesson) {
    return
  }

  currentLessonIdx
    .value =
    index

  await fetchLessonDetail(
    lesson.id
  )
}

function prevLesson() {
  if (
    currentLessonIdx
      .value >
    0
  ) {
    goToLesson(
      currentLessonIdx
        .value -
        1
    )
  }
}

function nextLesson() {
  if (
    !moduleData.value
  ) {
    return
  }

  if (
    currentLessonIdx
      .value <
    moduleData
      .value
      .module_lessons
      .length -
      1
  ) {
    goToLesson(
      currentLessonIdx
        .value +
        1
    )
  }
}

/* =========================================================
 * Mark Done
 * ======================================================= */

async function markDone() {
  if (
    !currentLesson.value ||
    !moduleData.value ||
    isDone.value
  ) {
    return
  }

  const id =
    currentLesson
      .value
      .id

  try {
    await markLessonCompleted(
      id
    )

    doneSet.value.add(
      id
    )

    /*
     * Update class progress
     */
    try {
      const token =
        await getValidToken()

      if (
        token &&
        moduleData.value
          .class_id
      ) {
        await $fetch(
          '/api/student/class-progress',
          {
            method:
              'POST',

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            body: {
              class_id:
                moduleData
                  .value
                  .class_id
            }
          }
        )
      }
    } catch (
      error
    ) {
      console.error(
        'Failed to update class progress:',
        error
      )
    }

    /*
     * Auto-next after complete
     */
    if (
      currentLessonIdx
        .value <
      moduleData
        .value
        .module_lessons
        .length -
        1
    ) {
      setTimeout(
        () => {
          nextLesson()
        },
        500
      )
    }
  } catch (
    error
  ) {
    console.error(
      'Failed to mark lesson completed:',
      error
    )
  }
}

/* =========================================================
 * Mount
 * ======================================================= */

onMounted(() => {
  fetchModule()
})
</script>