<script lang="ts" setup>
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { useBackButton } from '@ionic/vue'
import { tabRootPaths } from '../config'

useHead({
  title: 'Cook Tabs',
})

const router = useRouter()
const ionRouter = useIonRouter()

function isTabRootPath(path: string) {
  return tabRootPaths.includes(path)
}

onMounted(() => {
  if (Capacitor.getPlatform() === 'android') {
    useBackButton(10, () => {
      if (isTabRootPath(router.currentRoute.value.path)) {
        App.minimizeApp()
      }
      else {
        ionRouter.back()
      }
    })
  }
})
</script>

<template>
  <ion-page>
    <ion-content>
      <ion-tabs>
        <ion-router-outlet />

        <ion-tab-bar slot="bottom" class="custom-tab-bar">
          <ion-tab-button tab="home" href="/home" class="custom-tab-button">
            <div class="tab-content">
              <ion-icon :icon="ioniconsBookOutline" class="tab-icon" />
              <ion-label class="tab-label">
                做菜
              </ion-label>
            </div>
          </ion-tab-button>

          <IonTabButton tab="library" href="/library" class="custom-tab-button">
            <div class="tab-content">
              <ion-icon :icon="ioniconsLibraryOutline" class="tab-icon" />
              <ion-label class="tab-label">
                菜谱
              </ion-label>
            </div>
          </IonTabButton>

          <IonTabButton tab="apps" href="/apps" class="custom-tab-button">
            <div class="tab-content">
              <ion-icon :icon="ioniconsRestaurantOutline" class="tab-icon" />
              <ion-label class="tab-label">
                发现
              </ion-label>
            </div>
          </IonTabButton>

          <IonTabButton tab="chat" href="/chat" class="custom-tab-button">
            <div class="tab-content">
              <ion-icon :icon="ioniconsChatbubbleEllipsesOutline" class="tab-icon" />
              <ion-label class="tab-label">
                聊天
              </ion-label>
            </div>
          </IonTabButton>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.custom-tab-bar {
  --background: rgba(255, 255, 255, 0.95);
  --color: #6b7280;
  --color-selected: #ec4899;
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  height: 80px;
}

.custom-tab-button {
  --color: #6b7280;
  --color-selected: #ec4899;
  --ripple-color: rgba(236, 72, 153, 0.2);
  border-radius: 16px;
  margin: 4px 8px;
  transition: all 0.3s ease;
}

.custom-tab-button.tab-selected {
  --color-selected: #ec4899;
  background: rgba(236, 72, 153, 0.1);
  transform: translateY(-2px);
}

.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.tab-icon {
  font-size: 24px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.tab-label {
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  transition: all 0.3s ease;
}

.custom-tab-button.tab-selected .tab-icon {
  transform: scale(1.1);
  color: #ec4899;
}

.custom-tab-button.tab-selected .tab-label {
  color: #ec4899;
  font-weight: 600;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .custom-tab-bar {
    --background: rgba(17, 24, 39, 0.95);
    --color: #9ca3af;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .custom-tab-button {
    --color: #9ca3af;
  }

  .custom-tab-button.tab-selected {
    background: rgba(236, 72, 153, 0.15);
  }
}
</style>
