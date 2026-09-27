# Graph Report - Cartefidelité  (2026-09-27)

## Corpus Check
- 608 files · ~4,743,780 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 6, .example 4, .css 3)

## Summary
- 3306 nodes · 10115 edges · 161 communities (138 shown, 23 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 66 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `feb10c39`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- card-template-schema.ts
- rbac.ts
- merchant-card-template-service.ts
- next
- react
- vitest
- ref_next_navigation
- fife-life/merchant-detail.tsx
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- SelfVisualCropper
- card-editor-properties.tsx
- requireMutatingRequest
- loyalty-service.ts
- rateLimit
- wallet-home.tsx
- merchant-ui.tsx
- use-wallet-unlock-animation.ts
- staff-permissions.ts
- profile-page.tsx
- cashier-checkout.tsx
- loyalty-context.ts
- google-auth.ts
- env.ts
- caisse-client-number.test.ts
- jsonOk
- loyalty-commit.ts
- advantages-ui.tsx
- qr/route.ts
- create-super-admin.ts
- campaigns/[id]/confirm/route.ts
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- avatar/route.ts
- demo-session.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- interactive-loyalty-card.tsx
- ref_fs_promises
- demo-routing.test.ts
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- loyalty-program-publication.ts
- @prisma/client
- qa-login.ts
- playwright
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- HourlySchedulePicker
- demo-visual.ts
- ref_next_link
- loyalty-service.test.ts
- scripts
- qr-cache.ts
- platform-stats.ts
- google-wallet/route.ts
- GET
- merchant-profile.tsx
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- card-deck.tsx
- merchants-list.tsx
- types.ts
- AdvantagesEditor
- verify-viewports.mjs
- ref_next_server
- unsubscribe-token.ts
- EmployeeDetailPanel
- MerchantDetailPage
- ads/[id]/confirm/route.ts
- layout-shell.tsx
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- merchant-card-renderer.tsx
- landing-header.tsx
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- super-admin-session.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- ref_path
- caisse-scan-route.test.ts
- generate-pwa-icons.mjs
- src/app/layout.tsx
- programme/ui.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- preferences/route.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- getSessionUser
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- employee-session.ts
- insight-definitions.ts
- cn
- ad-confirm-route.test.ts
- ExpandableQrCode
- campaign-confirm-route.test.ts
- sponsored-hours-pricing.ts
- landing-page.test.ts
- campaign-quota.test.ts
- super-admin.test.ts
- webhook/route.ts
- lib/campaign-worker.ts
- discover-page.tsx
- statistiques-scroll.test.ts
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- trim-card-images.mjs
- loyalty-cards-capture.mjs
- campaign-test-mode-isolation.test.ts
- google-wallet-doctor.ts
- push-client.ts
- EmployeeLoginScreen
- CreateMerchantWizard
- capture-employe-app-screenshots.mjs
- qa-login/page.tsx
- jsonError
- CardEditorBackgroundCrop
- CampagnesPanel
- loyalty-rewards.ts
- use-media-query.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- SettingsPanel
- marketing-topup-route.test.ts
- capture-super-admin.mjs
- merchant-search-v1.mjs
- marketing-balance.test.ts
- solde/ui.tsx
- wallet-desktop-capture.mjs
- landing-merchant-preview.tsx
- campaign-audience.test.ts
- scripts/campaign-worker.ts

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 193 edges
2. `jsonOk()` - 175 edges
3. `requireMutatingRequest()` - 118 edges
4. `prisma` - 110 edges
5. `vitest` - 99 edges
6. `react` - 96 edges
7. `@prisma/client` - 91 edges
8. `clientIp()` - 90 edges
9. `userAgent()` - 86 edges
10. `readJson()` - 84 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `configWithWidget()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/loyalty-widget.test.tsx → src/lib/card-template-schema.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (161 total, 23 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.18
Nodes (18): logScanBody(), POST(), scanVia(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber() (+10 more)

### Community 1 - "card-template-schema.ts"
Cohesion: 0.12
Nodes (18): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle, CardProgressColors (+10 more)

### Community 2 - "rbac.ts"
Cohesion: 0.12
Nodes (17): heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), canViewStatistics(), MAX_ACTIVE_EMPLOYEES (+9 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.07
Nodes (62): PATCH(), POST(), LegacyCardEditorRedirect(), CardEditorVariantRoute(), normalizeCardTemplateForSlot(), cardTemplateConfigSchema, defaultCardTemplateConfig(), ALL_MERCHANT_CARD_SLOTS (+54 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "react"
Cohesion: 0.10
Nodes (25): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), EmployeeInvitationScreen(), ChangePasswordPage(), LOYALTY_MODES (+17 more)

### Community 6 - "vitest"
Cohesion: 0.07
Nodes (40): ref_node_fs, ref_node_path, vitest, outDir, outDir, outDir, buildScanResult(), block() (+32 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.24
Nodes (21): ref_next_navigation, CampagnesPage(), SoldeMarketingPage(), CustomerDetailPage(), ClientsPage(), CustomerDetailPanel(), EmployeeDetailPage(), EmployeesPage() (+13 more)

### Community 8 - "fife-life/merchant-detail.tsx"
Cohesion: 0.12
Nodes (16): AddToGoogleWalletButton(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard() (+8 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (34): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetView(), pct(), ProgressCircle() (+26 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.09
Nodes (42): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel(), publishValidationResult(), CardLoyaltyWidgetConfig (+34 more)

### Community 11 - "validation.ts"
Cohesion: 0.07
Nodes (40): zod, schema, GET(), POST(), GET(), POST(), deleteSchema, acceptInvitationWithPassword() (+32 more)

### Community 12 - "SelfVisualCropper"
Cohesion: 0.16
Nodes (12): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), onCropConfirm(), onFidetoFilesSelected() (+4 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (61): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+53 more)

### Community 14 - "requireMutatingRequest"
Cohesion: 0.13
Nodes (50): POST(), POST(), POST(), POST(), POST(), POST(), POST(), POST() (+42 more)

### Community 15 - "loyalty-service.ts"
Cohesion: 0.14
Nodes (24): AmountField(), press(), KEYS, activityFromWalletEvent(), formatActivityDate(), formatActivityFromTransaction(), applyAdjustment(), applyEarnVisit() (+16 more)

### Community 16 - "rateLimit"
Cohesion: 0.22
Nodes (15): POST(), POST(), GET(), requireStandardUser(), accessToken(), GoogleWalletApiError, src_lib_google_wallet_isgooglewalletconfigured, publicGoogleWalletError() (+7 more)

### Community 17 - "wallet-home.tsx"
Cohesion: 0.12
Nodes (21): ref_motion_react, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), ExpandableQrCodeProps, DiscoverIconLink() (+13 more)

### Community 18 - "merchant-ui.tsx"
Cohesion: 0.11
Nodes (23): Customer, CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel(), formatActivity() (+15 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.17
Nodes (19): isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible(), WalletHome(), googleWalletEndpointForActiveCard(), markWalletEventSeen(), cardFromUnlockPayload() (+11 more)

### Community 20 - "staff-permissions.ts"
Cohesion: 0.13
Nodes (10): EmployeeScanPage(), DEMO_EMPLOYEE, ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS, EMPLOYEE_FIXED_PERMISSIONS, MANAGER_DEFAULT, PERMISSION_KEYS (+2 more)

### Community 21 - "profile-page.tsx"
Cohesion: 0.08
Nodes (36): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+28 more)

### Community 22 - "cashier-checkout.tsx"
Cohesion: 0.26
Nodes (12): CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase, RewardCard(), statusClass(), commitCaisseTransaction() (+4 more)

### Community 23 - "loyalty-context.ts"
Cohesion: 0.11
Nodes (34): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, src_lib_demo_visual_client_demo_cookie (+26 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "env.ts"
Cohesion: 0.08
Nodes (29): dynamic, dynamic, assertSameOrigin(), CsrfError, env, getAllowedOrigins(), hostMatches(), hostnameOf() (+21 more)

### Community 26 - "caisse-client-number.test.ts"
Cohesion: 0.21
Nodes (10): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken(), scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique (+2 more)

### Community 27 - "jsonOk"
Cohesion: 0.07
Nodes (59): POST(), GET(), schema, GET(), GET(), DELETE(), FILTER_MAP, GET() (+51 more)

### Community 28 - "loyalty-commit.ts"
Cohesion: 0.10
Nodes (39): buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction() (+31 more)

### Community 29 - "advantages-ui.tsx"
Cohesion: 0.15
Nodes (16): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+8 more)

### Community 30 - "qr/route.ts"
Cohesion: 0.15
Nodes (18): qrcode, dynamic, logCustomerQr(), POST(), runtime, schema, ensureCustomerMembershipForSlug(), ensureCustomerQrToken() (+10 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "campaigns/[id]/confirm/route.ts"
Cohesion: 0.14
Nodes (30): computeAdPricing(), POST(), GET(), GET(), AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience() (+22 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.10
Nodes (32): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+24 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.07
Nodes (35): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+27 more)

### Community 37 - "avatar/route.ts"
Cohesion: 0.33
Nodes (7): DELETE(), AVATAR_DIR, deleteAvatarFiles(), MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar(), avatarUploadSchema

### Community 38 - "demo-session.ts"
Cohesion: 0.15
Nodes (19): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), DemoRole (+11 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.13
Nodes (33): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+25 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.14
Nodes (25): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCampaignMedia(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig (+17 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "interactive-loyalty-card.tsx"
Cohesion: 0.10
Nodes (26): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, LADDER, resolveTier() (+18 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.13
Nodes (13): ref_fs_promises, ref_os, OUT, tiers, GET(), MIME, GET(), MIME (+5 more)

### Community 45 - "demo-routing.test.ts"
Cohesion: 0.14
Nodes (16): ref_next_headers, CaisseAliasPage(), EmployeeHomePage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled() (+8 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.09
Nodes (30): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+22 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (19): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+11 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "@prisma/client"
Cohesion: 0.08
Nodes (41): @prisma/client, dynamic, GET(), MerchantRewardProgressPanel(), TargetBlock(), buildCardNextRewardEntry(), buildFifeLifeNextReward(), buildHistoricalRewardOverview() (+33 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.09
Nodes (36): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), GET(), POST(), QaExchangeBody, qaJson() (+28 more)

### Community 52 - "playwright"
Cohesion: 0.10
Nodes (10): ref_node_fs_promises, playwright, OUT, OUT, shots, OUT, OUT, OUT (+2 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.12
Nodes (48): isGoogleWalletConfigured(), appLinkData(), assertConfigured(), availableRewardModules(), buildGoogleWalletIds(), buildGoogleWalletMerchantView(), cardUrl(), classProfileForMode() (+40 more)

### Community 55 - "email.ts"
Cohesion: 0.25
Nodes (14): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+6 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.06
Nodes (70): GET(), PERIOD_KEYS, requireMerchantStatsAccess(), addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys() (+62 more)

### Community 58 - "HourlySchedulePicker"
Cohesion: 0.22
Nodes (6): addDaysToDateInput(), bandForHour(), formatHourRange(), HourlySchedulePicker(), addDay(), todayDateInputValue()

### Community 59 - "demo-visual.ts"
Cohesion: 0.11
Nodes (22): CaissePage(), DashboardLayout(), MerchantHomePage(), CarteIdentitePage(), PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE, DEMO_EMAIL (+14 more)

### Community 60 - "ref_next_link"
Cohesion: 0.10
Nodes (11): ref_next_link, SPACES, COLUMNS, isInternalPath(), LandingFooter(), MerchantCardsGallery(), slotStatusLabel(), slotTone() (+3 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "qr-cache.ts"
Cohesion: 0.12
Nodes (22): ref_react_dom_server, MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_QR, QrBlock(), cache, cacheKey() (+14 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.23
Nodes (15): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+7 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.14
Nodes (24): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+16 more)

### Community 66 - "GET"
Cohesion: 0.53
Nodes (5): GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), shouldSendSseEvent()

### Community 67 - "merchant-profile.tsx"
Cohesion: 0.15
Nodes (16): dynamic, MerchantProfilePage(), JoinMerchantPage(), formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl() (+8 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "card-deck.tsx"
Cohesion: 0.18
Nodes (13): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+5 more)

### Community 71 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 72 - "types.ts"
Cohesion: 0.18
Nodes (7): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, ScanResultCardPayload

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 75 - "ref_next_server"
Cohesion: 0.06
Nodes (25): ref_next_server, campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest (+17 more)

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.24
Nodes (9): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken(), consentEventCreateMany (+1 more)

### Community 77 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "ads/[id]/confirm/route.ts"
Cohesion: 0.12
Nodes (32): stripe, POST(), GET(), POST(), topupSchema, isValidTopupAmountCents(), MAX_TOPUP_CENTS, MIN_TOPUP_CENTS (+24 more)

### Community 80 - "layout-shell.tsx"
Cohesion: 0.08
Nodes (19): recharts, AdRequest, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget, ACTIVITY_LABELS, DashboardHome() (+11 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "qr.ts"
Cohesion: 0.26
Nodes (10): main(), prisma, requiredEnv(), upsertEmployee(), assertQrUsable(), QrError, QrPayload, secretKey() (+2 more)

### Community 85 - "merchant-card-renderer.tsx"
Cohesion: 0.14
Nodes (30): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc() (+22 more)

### Community 86 - "landing-header.tsx"
Cohesion: 0.29
Nodes (6): next-themes, MoonIcon(), SunIcon(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "super-admin-session.ts"
Cohesion: 0.10
Nodes (23): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminCampagnesPage(), SuperAdminCardsPage() (+15 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (17): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+9 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "ref_path"
Cohesion: 0.19
Nodes (7): ref_fs, ref_path, ref_vitest_config, outDir, main(), outDir, shot()

### Community 102 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 103 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.14
Nodes (9): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR (+1 more)

### Community 105 - "programme/ui.tsx"
Cohesion: 0.16
Nodes (14): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+6 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "preferences/route.ts"
Cohesion: 0.16
Nodes (22): GET(), PATCH(), GET(), PATCH(), bodySchema, POST(), AccountPage(), ParametresPage() (+14 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "getSessionUser"
Cohesion: 0.11
Nodes (18): EmployeeLoginPage(), dynamic, NotificationsPage(), ProEntryPage(), SPACES, DEMO_NOTIFICATIONS, kindLabel(), NotificationItem (+10 more)

### Community 118 - "employee-session.ts"
Cohesion: 0.28
Nodes (11): cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession, employeeTokenFromRequest() (+3 more)

### Community 120 - "cn"
Cohesion: 0.13
Nodes (19): DashboardLayout(), ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate() (+11 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.13
Nodes (12): adRequestFindFirst, adRequestUpdate, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage, paymentUpsert (+4 more)

### Community 122 - "ExpandableQrCode"
Cohesion: 0.40
Nodes (4): ref_react_dom_client, ExpandableQrCode(), handleActivate(), openQr()

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-hours-pricing.ts"
Cohesion: 0.15
Nodes (15): GET(), estimateSponsorPricing(), parisHourInstant(), isWithinUtcIntervals(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, priceSponsoredHours() (+7 more)

### Community 125 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 126 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 127 - "super-admin.test.ts"
Cohesion: 0.14
Nodes (19): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+11 more)

### Community 128 - "webhook/route.ts"
Cohesion: 0.21
Nodes (16): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), isCancellable() (+8 more)

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.25
Nodes (12): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+4 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.27
Nodes (5): DiscoverPage(), Merchant, Sponsored, SponsoredAd, SponsoredBanner()

### Community 131 - "statistiques-scroll.test.ts"
Cohesion: 0.33
Nodes (4): appNav, globalsCss, layoutClient, statistiquesPanel

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.13
Nodes (25): POST(), GET(), POST(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET() (+17 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 135 - "trim-card-images.mjs"
Cohesion: 0.40
Nodes (3): ref_sharp, files, INPUT_DIR

### Community 136 - "loyalty-cards-capture.mjs"
Cohesion: 0.40
Nodes (3): goto(), OUT, tiers

### Community 137 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 138 - "google-wallet-doctor.ts"
Cohesion: 0.52
Nodes (6): google-auth-library, accessToken(), fail(), main(), ok(), pngSize()

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 141 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 142 - "capture-employe-app-screenshots.mjs"
Cohesion: 0.67
Nodes (3): main(), outDir, shot()

### Community 143 - "qa-login/page.tsx"
Cohesion: 0.38
Nodes (4): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken()

### Community 144 - "jsonError"
Cohesion: 0.09
Nodes (37): GET(), PATCH(), GET(), POST(), POST(), schema, GET(), GET() (+29 more)

### Community 146 - "CampagnesPanel"
Cohesion: 0.18
Nodes (4): audienceDisplay(), CampagnesPanel(), CampaignWizard(), statusTone()

### Community 147 - "loyalty-rewards.ts"
Cohesion: 0.25
Nodes (10): assertEarnProgramRules(), evaluateReward(), parseRewardConditions(), RewardConditions, rewardIsStackable(), RewardStatus, RewardUsage, sortEvaluatedRewards() (+2 more)

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.17
Nodes (17): employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR (+9 more)

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 155 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 156 - "solde/ui.tsx"
Cohesion: 0.24
Nodes (12): SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, formatCents(), formatDate(), ledgerLabel(), MarketingBalanceSummary() (+4 more)

### Community 158 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 160 - "scripts/campaign-worker.ts"
Cohesion: 0.70
Nodes (4): log(), loop(), requestShutdown(), sleep()

## Knowledge Gaps
- **838 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+833 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1121 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `webhook/route.ts`, `lib/campaign-worker.ts`, `caisse-scan.ts`, `merchant-card-template-service.ts`, `employees/[id]/route.ts`, `rbac.ts`, `react`, `statistiques-scroll.test.ts`, `super-admin-campaign-moderation.test.ts`, `campaign-test-mode-isolation.test.ts`, `loyalty-widget.ts`, `push-client.ts`, `loyalty-widget-view.tsx`, `card-editor-properties.tsx`, `loyalty-service.ts`, `jsonError`, `use-wallet-unlock-animation.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `loyalty-context.ts`, `google-auth.ts`, `env.ts`, `caisse-client-number.test.ts`, `marketing-balance.test.ts`, `loyalty-commit.ts`, `marketing-topup-route.test.ts`, `qr/route.ts`, `campaign-audience.test.ts`, `campaigns/[id]/confirm/route.ts`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `ref_fs_promises`, `demo-routing.test.ts`, `loyalty-program-publication.ts`, `@prisma/client`, `qa-login.ts`, `email.ts`, `insight-stats.ts`, `loyalty-service.test.ts`, `qr-cache.ts`, `platform-stats.ts`, `google-wallet/route.ts`, `merchant-profile.tsx`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `card-deck.tsx`, `ref_next_server`, `unsubscribe-token.ts`, `ads/[id]/confirm/route.ts`, `qr.ts`, `merchant-card-renderer.tsx`, `ref_path`, `caisse-scan-route.test.ts`, `src/app/layout.tsx`, `campaign-worker.test.ts`, `getSessionUser`, `ad-confirm-route.test.ts`, `ExpandableQrCode`, `campaign-confirm-route.test.ts`, `landing-page.test.ts`, `campaign-quota.test.ts`, `super-admin.test.ts`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `webhook/route.ts`, `lib/campaign-worker.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `employees/[id]/route.ts`, `vitest`, `fife-life/merchant-detail.tsx`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `requireMutatingRequest`, `loyalty-service.ts`, `jsonError`, `wallet-home.tsx`, `loyalty-rewards.ts`, `staff-permissions.ts`, `profile-page.tsx`, `cashier-checkout.tsx`, `employee-invitation-service.ts`, `google-auth.ts`, `loyalty-context.ts`, `use-wallet-unlock-animation.ts`, `jsonOk`, `loyalty-commit.ts`, `advantages-ui.tsx`, `qr/route.ts`, `create-super-admin.ts`, `campaigns/[id]/confirm/route.ts`, `card-editor.tsx`, `package.json`, `loyalty-program-publication.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `demo-visual.ts`, `ref_next_link`, `loyalty-service.test.ts`, `platform-stats.ts`, `merchant-profile.tsx`, `types.ts`, `ads/[id]/confirm/route.ts`, `qr.ts`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `programme/ui.tsx`, `preferences/route.ts`, `employee-session.ts`, `cn`, `env.ts`, `super-admin.test.ts`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `card-template-schema.ts`, `discover-page.tsx`, `merchant-card-template-service.ts`, `fife-life/merchant-detail.tsx`, `loyalty-widget-view.tsx`, `card-editor-properties.tsx`, `qa-login/page.tsx`, `wallet-home.tsx`, `merchant-ui.tsx`, `use-wallet-unlock-animation.ts`, `use-media-query.ts`, `profile-page.tsx`, `cashier-checkout.tsx`, `solde/ui.tsx`, `advantages-ui.tsx`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `scan/ui.tsx`, `interactive-loyalty-card.tsx`, `src/app/page.tsx`, `wallet-event-dedup.ts`, `@prisma/client`, `ref_next_link`, `qr-cache.ts`, `merchant-profile.tsx`, `card-deck.tsx`, `merchants-list.tsx`, `types.ts`, `layout-shell.tsx`, `merchant-card-renderer.tsx`, `landing-header.tsx`, `super-admin-session.ts`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `programme/ui.tsx`, `getSessionUser`, `cn`, `ExpandableQrCode`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _838 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `card-template-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Should `rbac.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11692307692307692 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06720321931589537 - nodes in this community are weakly interconnected._