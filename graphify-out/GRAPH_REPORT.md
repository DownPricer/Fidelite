# Graph Report - Cartefidelité  (2026-09-25)

## Corpus Check
- 603 files · ~4,737,994 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 6, .example 4, .css 3)

## Summary
- 3253 nodes · 9963 edges · 161 communities (137 shown, 24 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f8a90770`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- insight-period.ts
- card-template-schema.ts
- rbac.ts
- merchant-card-template-service.ts
- next
- react
- loyalty-program.ts
- ref_next_navigation
- fife-life/merchant-detail.tsx
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- card-editor-properties.tsx
- card-editor-canvas.tsx
- requireMutatingRequest
- loyalty-service.ts
- http.ts
- wallet-hydration.test.tsx
- merchant-ui.tsx
- wallet-home.tsx
- outils/ui.tsx
- profile-page.tsx
- @prisma/client
- caisse-scan.ts
- google-auth.ts
- ref_next_server
- jsonError
- prisma.ts
- loyalty-commit.ts
- advantages-ui.tsx
- qr/route.ts
- create-super-admin.ts
- campaigns/[id]/confirm/route.ts
- card-editor.tsx
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- api-merchant-statistics-route.test.ts
- demo-session.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- card-enlarged-view.tsx
- ref_fs_promises
- employee-demo-server.ts
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- loyalty-program-publication.ts
- customer-loyalty-overview.ts
- qa-login.ts
- ref_node_path
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- MerchantHome
- demo-visual.ts
- ref_next_link
- loyalty-service.test.ts
- scripts
- qr-cache.ts
- platform-stats.ts
- google-wallet/route.ts
- events/route.ts
- loyalty-context.ts
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- card-deck.tsx
- [id]/merchant-detail.tsx
- types.ts
- AdvantagesEditor
- verify-viewports.mjs
- caisse-scan-route.test.ts
- unsubscribe-token.ts
- EmployeeDetailPanel
- MerchantDetailPage
- stripe.ts
- layout-shell.tsx
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- merchant-card-renderer.tsx
- customer-preferences-route.test.ts
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
- vitest
- merchant-app-access.ts
- generate-pwa-icons.mjs
- src/app/layout.tsx
- programme/ui.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- requireUser
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- employee-session.ts
- insight-definitions.ts
- cn
- ad-confirm-route.test.ts
- demo-mode.ts
- campaign-confirm-route.test.ts
- getSessionUser
- landing-page.test.ts
- env.ts
- super-admin.test.ts
- webhook/route.ts
- lib/campaign-worker.ts
- discover-page.tsx
- cards-index.tsx
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- buildGoogleWalletMerchantView
- campaign-crud-routes.test.ts
- campaign-test-mode-isolation.test.ts
- google-wallet-doctor.ts
- push-client.ts
- statistics/route.ts
- campaign-moderation-home.tsx
- loyalty-reward-removal.ts
- qa-login/page.tsx
- jsonOk
- CardEditorBackgroundCrop
- CampaignWizard
- employee-access.test.ts
- use-media-query.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- SettingsPanel
- marketing-topup-route.test.ts
- google-wallet-logo.test.ts
- prisma
- marketing-balance.ts
- SponsorWizard
- QuotaExceededError
- app/statistiques/page.tsx
- scripts/campaign-worker.ts
- CampagnesPanel

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 191 edges
2. `jsonOk()` - 173 edges
3. `requireMutatingRequest()` - 117 edges
4. `prisma` - 110 edges
5. `vitest` - 99 edges
6. `react` - 95 edges
7. `@prisma/client` - 91 edges
8. `clientIp()` - 90 edges
9. `userAgent()` - 86 edges
10. `readJson()` - 83 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `legacyTemplateWithoutQr()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/wallet-hydration.test.tsx → src/lib/card-template-schema.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (161 total, 24 thin omitted)

### Community 0 - "insight-period.ts"
Cohesion: 0.20
Nodes (24): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+16 more)

### Community 1 - "card-template-schema.ts"
Cohesion: 0.11
Nodes (27): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), CardDecorativeStyle, cardElementSchema (+19 more)

### Community 2 - "rbac.ts"
Cohesion: 0.18
Nodes (13): CustomerDetailPage(), CustomerDetailPanel(), assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), canViewAllCustomers(), MAX_ACTIVE_EMPLOYEES, staffHasPermission() (+5 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (53): CardEditorVariantRoute(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, isLoyaltyProgramSlot(), loyaltyModeForCardSlot(), merchantCardsGalleryPath(), parseCardSlotSlug() (+45 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "react"
Cohesion: 0.08
Nodes (27): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), EmployeeInvitationScreen(), ChangePasswordPage(), SPACES (+19 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.11
Nodes (32): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, EarnHistory, evaluateEarn(), formatDurationMinutes(), LoyaltyAction (+24 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.27
Nodes (18): ref_next_navigation, CampagnesPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), OutilsPage(), MerchantHomePage() (+10 more)

### Community 8 - "fife-life/merchant-detail.tsx"
Cohesion: 0.11
Nodes (15): AddToGoogleWalletButton(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard() (+7 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.15
Nodes (13): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetView(), pct(), ProgressCircle(), Props (+5 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (48): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), applyEditorAutoFix(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+40 more)

### Community 11 - "validation.ts"
Cohesion: 0.08
Nodes (26): FILTER_MAP, GET(), formatFifeLifeEntry(), acceptInvitationSchema, adjustmentSchema, adModerationSchema, adRequestCreateSchema, caisseActionSchema (+18 more)

### Community 12 - "card-editor-properties.tsx"
Cohesion: 0.09
Nodes (29): TextBlock(), CardEditorProperties(), patchRect(), REQUIRED_BY_SLOT, TEXT_TYPES, qrOverlapsOthers(), buildTextContainerStyle(), multilineClampStyle() (+21 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.10
Nodes (46): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+38 more)

### Community 14 - "requireMutatingRequest"
Cohesion: 0.15
Nodes (47): POST(), POST(), POST(), POST(), POST(), POST(), logScanBody(), POST() (+39 more)

### Community 15 - "loyalty-service.ts"
Cohesion: 0.17
Nodes (17): updateWalletBalance(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), incrementBalanceData(), legacyPointsForUnitBalance(), LoyaltyBalanceFields, setActiveBalanceData() (+9 more)

### Community 16 - "http.ts"
Cohesion: 0.12
Nodes (28): zod, schema, GET(), POST(), POST(), POST(), schema, POST() (+20 more)

### Community 17 - "wallet-hydration.test.tsx"
Cohesion: 0.12
Nodes (21): ref_motion_react, react-dom, ref_react_dom_client, CardsSheet(), ExpandableQrCode(), handleActivate(), openQr(), ExpandableQrCodeProps (+13 more)

### Community 18 - "merchant-ui.tsx"
Cohesion: 0.16
Nodes (17): Customer, CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel(), formatActivity() (+9 more)

### Community 19 - "wallet-home.tsx"
Cohesion: 0.14
Nodes (25): DiscoverIconLink(), NotificationBellLink(), preloadWalletQr(), WalletEventPayload, useWalletEvents(), connect(), disconnect(), onVisibility() (+17 more)

### Community 20 - "outils/ui.tsx"
Cohesion: 0.29
Nodes (5): FidelisationPanel(), icons, OutilsPanel(), TOOLS, ToolCard()

### Community 21 - "profile-page.tsx"
Cohesion: 0.07
Nodes (40): AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_PROFILE_HISTORY, AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage() (+32 more)

### Community 22 - "@prisma/client"
Cohesion: 0.15
Nodes (24): @prisma/client, buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), buildTargetView(), resolveVisualState(), MerchantRewardProgressTarget (+16 more)

### Community 23 - "caisse-scan.ts"
Cohesion: 0.14
Nodes (26): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, buildScanResult() (+18 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "ref_next_server"
Cohesion: 0.13
Nodes (20): ref_next_server, hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost() (+12 more)

### Community 26 - "jsonError"
Cohesion: 0.10
Nodes (34): GET(), PATCH(), GET(), POST(), GET(), GET(), GET(), GET() (+26 more)

### Community 27 - "prisma.ts"
Cohesion: 0.13
Nodes (18): POST(), schema, POST(), POST(), GET(), GET(), GET(), createDirectEmployee() (+10 more)

### Community 28 - "loyalty-commit.ts"
Cohesion: 0.10
Nodes (36): appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive(), loadEarnHistory() (+28 more)

### Community 29 - "advantages-ui.tsx"
Cohesion: 0.15
Nodes (16): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+8 more)

### Community 30 - "qr/route.ts"
Cohesion: 0.16
Nodes (17): dynamic, logCustomerQr(), POST(), runtime, schema, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+9 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "campaigns/[id]/confirm/route.ts"
Cohesion: 0.18
Nodes (29): POST(), POST(), GET(), GET(), GET(), AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience() (+21 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.10
Nodes (30): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+22 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (25): description, engines, node, name, private, version, eslint, eslint-config-next (+17 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (31): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+23 more)

### Community 37 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 38 - "demo-session.ts"
Cohesion: 0.16
Nodes (17): ref_next_headers, GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget() (+9 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.05
Nodes (69): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+61 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.12
Nodes (27): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig, deleteCardBackgroundIfUnused() (+19 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "card-enlarged-view.tsx"
Cohesion: 0.09
Nodes (32): CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard() (+24 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.08
Nodes (18): ref_fs_promises, ref_os, ref_sharp, OUT, shots, OUT, tiers, files (+10 more)

### Community 45 - "employee-demo-server.ts"
Cohesion: 0.28
Nodes (8): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, src_lib_employee_demo_employee_demo_cookie, isEmployeeDemoCookie(), isEmployeeDevDemo(), resolveEmployeeDemo()

### Community 46 - "src/app/page.tsx"
Cohesion: 0.06
Nodes (41): next-themes, BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS (+33 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.26
Nodes (14): canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent(), markCardAnimated(), markWalletEventSeen(), memoryAnimatedCards, memoryLastEventId (+6 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "customer-loyalty-overview.ts"
Cohesion: 0.14
Nodes (25): activityFromWalletEvent(), ActivityItem, buildCardNextRewardEntry(), buildHistoricalRewardOverview(), buildNextRewardCandidates(), CardNextRewardEntry, CardRewardProgress, formatActivityDate() (+17 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (41): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), GET(), isProduction(), assertQaLoginTtlMinutes(), auditQaLogin() (+33 more)

### Community 52 - "ref_node_path"
Cohesion: 0.06
Nodes (21): ref_node_fs_promises, ref_node_path, playwright, OUT, OUT, shots, outDir, outDir (+13 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.17
Nodes (30): accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue(), ensureGlobalClassRecord() (+22 more)

### Community 55 - "email.ts"
Cohesion: 0.23
Nodes (15): nodemailer, buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml() (+7 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.11
Nodes (26): InsightRange, percentChange(), buildFinancial(), buildOverview(), buildRewards(), buildSegments(), buildTeam(), getInsightPremium() (+18 more)

### Community 59 - "demo-visual.ts"
Cohesion: 0.15
Nodes (14): CarteIdentitePage(), PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE, CustomerLoyaltyOverview, DEMO_LOYALTY_OVERVIEW, DEMO_EMAIL, DEMO_FIRST_NAME (+6 more)

### Community 60 - "ref_next_link"
Cohesion: 0.10
Nodes (14): ref_next_link, HomeStats, QUICK_ACTIONS, StatsPreview, TrendMetric, SPACES, COLUMNS, isInternalPath() (+6 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "qr-cache.ts"
Cohesion: 0.12
Nodes (20): ref_react_dom_server, MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_QR, QrBlock(), cache, cacheKey() (+12 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.30
Nodes (11): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), PeriodKey (+3 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.18
Nodes (21): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+13 more)

### Community 66 - "events/route.ts"
Cohesion: 0.18
Nodes (15): POST(), dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk() (+7 more)

### Community 67 - "loyalty-context.ts"
Cohesion: 0.15
Nodes (23): ref_node_fs, formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), ActiveMerchantLoyaltyContext, isMerchantOperational() (+15 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "card-deck.tsx"
Cohesion: 0.18
Nodes (13): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+5 more)

### Community 71 - "[id]/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+10 more)

### Community 72 - "types.ts"
Cohesion: 0.17
Nodes (8): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList(), ScanResultCardPayload

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 75 - "caisse-scan-route.test.ts"
Cohesion: 0.09
Nodes (15): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit, inAppNotificationCount, inAppNotificationFindMany (+7 more)

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.22
Nodes (10): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken() (+2 more)

### Community 77 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "stripe.ts"
Cohesion: 0.12
Nodes (23): stripe, CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, createCampaignCheckoutSession(), createMarketingTopupCheckoutSession(), getStripeClient() (+15 more)

### Community 80 - "layout-shell.tsx"
Cohesion: 0.09
Nodes (15): recharts, ACTIVITY_LABELS, DashboardHome(), Overview, QUICK_LINKS, SuperAdminStatsPage(), StatisticsPage(), NAV (+7 more)

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
Cohesion: 0.25
Nodes (11): main(), prisma, requiredEnv(), upsertEmployee(), processCaisseScan(), assertQrUsable(), QrError, QrPayload (+3 more)

### Community 85 - "merchant-card-renderer.tsx"
Cohesion: 0.10
Nodes (37): CardTemplateBackground(), COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps (+29 more)

### Community 86 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "super-admin-session.ts"
Cohesion: 0.10
Nodes (24): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminCampagnesPage(), SuperAdminCardsPage() (+16 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (18): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, BalanceData, CampaignSummary, Channel (+10 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "vitest"
Cohesion: 0.09
Nodes (18): ref_fs, ref_path, vitest, ref_vitest_config, main(), outDir, shot(), outDir (+10 more)

### Community 102 - "merchant-app-access.ts"
Cohesion: 0.27
Nodes (10): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, MerchantAppAccess, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace() (+2 more)

### Community 103 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.22
Nodes (7): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister()

### Community 105 - "programme/ui.tsx"
Cohesion: 0.14
Nodes (16): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+8 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "requireUser"
Cohesion: 0.08
Nodes (36): DELETE(), dynamic, GET(), dynamic, GET(), dynamic, GET(), GET() (+28 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "notifications-center.tsx"
Cohesion: 0.19
Nodes (10): dynamic, NotificationsPage(), DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+2 more)

### Community 118 - "employee-session.ts"
Cohesion: 0.14
Nodes (18): EmployeeLoginPage(), EmployeeLoginScreen(), onSubmit(), readApiJson(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName() (+10 more)

### Community 120 - "cn"
Cohesion: 0.15
Nodes (13): DashboardLayout(), CreateMerchantWizard(), goNext(), stepError(), AppNav(), icons, isActive(), TOOLS_PREFIXES (+5 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.13
Nodes (12): adRequestFindFirst, adRequestUpdate, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage, paymentUpsert (+4 more)

### Community 122 - "demo-mode.ts"
Cohesion: 0.19
Nodes (12): CLIENT_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE, DemoRole, isMerchantDemoCookieValue(), merchantDemoActiveFromRequest() (+4 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "getSessionUser"
Cohesion: 0.16
Nodes (17): GET(), LOYALTY_MODES, GET(), dynamic, MerchantProfilePage(), ProEntryPage(), JoinMerchantPage(), getPublishedCardTemplate() (+9 more)

### Community 125 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 126 - "env.ts"
Cohesion: 0.16
Nodes (6): dynamic, dynamic, assertSameOrigin(), CsrfError, env, getAllowedOrigins()

### Community 127 - "super-admin.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 128 - "webhook/route.ts"
Cohesion: 0.21
Nodes (16): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), isCancellable() (+8 more)

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.28
Nodes (11): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+3 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.27
Nodes (5): DiscoverPage(), Merchant, Sponsored, SponsoredAd, SponsoredBanner()

### Community 131 - "cards-index.tsx"
Cohesion: 0.25
Nodes (12): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+4 more)

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.24
Nodes (15): GET(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST() (+7 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "push.ts"
Cohesion: 0.33
Nodes (7): isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 135 - "buildGoogleWalletMerchantView"
Cohesion: 0.25
Nodes (18): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), googleWalletLogoUrl() (+10 more)

### Community 136 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 137 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 138 - "google-wallet-doctor.ts"
Cohesion: 0.24
Nodes (11): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert (+3 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "statistics/route.ts"
Cohesion: 0.29
Nodes (10): GET(), GET(), PERIOD_KEYS, InsightPeriodKey, resolvePeriod(), getFreeMerchantStats(), getHomeStats(), getLockedInsightPlaceholder() (+2 more)

### Community 141 - "campaign-moderation-home.tsx"
Cohesion: 0.25
Nodes (5): AdRequest, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 142 - "loyalty-reward-removal.ts"
Cohesion: 0.47
Nodes (4): decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval()

### Community 143 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 144 - "jsonOk"
Cohesion: 0.12
Nodes (28): POST(), GET(), GET(), POST(), DELETE(), GET(), loadOwnedCampaign(), PATCH() (+20 more)

### Community 146 - "CampaignWizard"
Cohesion: 0.20
Nodes (8): audienceDisplay(), CampaignWizard(), formatCents(), formatDate(), ledgerLabel(), MarketingBalanceCard(), topup(), startTopup()

### Community 147 - "employee-access.test.ts"
Cohesion: 0.53
Nodes (4): assertEarnProgramRules(), employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie()

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.17
Nodes (19): GET(), POST(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate() (+11 more)

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 155 - "marketing-balance.ts"
Cohesion: 0.17
Nodes (12): debitForCampaign(), MAX_TOPUP_CENTS, MIN_TOPUP_CENTS, TOPUP_PRESETS_CENTS, StripeModeValue, Entry, makeTx(), Mode (+4 more)

### Community 156 - "SponsorWizard"
Cohesion: 0.29
Nodes (5): addDaysToDateInput(), estimateSponsorPrice(), nowTimeInputValue(), SponsorWizard(), todayDateInputValue()

### Community 158 - "app/statistiques/page.tsx"
Cohesion: 0.20
Nodes (8): heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), canViewStatistics(), admin, cashier, grantedCashier, manager

### Community 160 - "scripts/campaign-worker.ts"
Cohesion: 0.70
Nodes (4): log(), loop(), requestShutdown(), sleep()

## Knowledge Gaps
- **833 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+828 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1110 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `webhook/route.ts`, `lib/campaign-worker.ts`, `rbac.ts`, `insight-period.ts`, `merchant-card-template-service.ts`, `react`, `loyalty-program.ts`, `super-admin-campaign-moderation.test.ts`, `campaign-crud-routes.test.ts`, `campaign-test-mode-isolation.test.ts`, `google-wallet-doctor.ts`, `loyalty-widget.ts`, `statistics/route.ts`, `card-editor-canvas.tsx`, `loyalty-reward-removal.ts`, `loyalty-service.ts`, `push-client.ts`, `wallet-hydration.test.tsx`, `employee-access.test.ts`, `wallet-home.tsx`, `caisse-scan.test.ts`, `@prisma/client`, `caisse-scan.ts`, `employee-invitation-service.ts`, `ref_next_server`, `google-auth.ts`, `prisma.ts`, `google-wallet-logo.test.ts`, `loyalty-commit.ts`, `qr/route.ts`, `app/statistiques/page.tsx`, `campaigns/[id]/confirm/route.ts`, `marketing-balance.ts`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `api-merchant-statistics-route.test.ts`, `demo-session.ts`, `card-template-schema.ts`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `ref_fs_promises`, `src/app/page.tsx`, `loyalty-program-publication.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `ref_node_path`, `email.ts`, `loyalty-service.test.ts`, `qr-cache.ts`, `platform-stats.ts`, `loyalty-context.ts`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `card-deck.tsx`, `caisse-scan-route.test.ts`, `unsubscribe-token.ts`, `stripe.ts`, `layout-shell.tsx`, `qr.ts`, `merchant-card-renderer.tsx`, `customer-preferences-route.test.ts`, `merchant-app-access.ts`, `campaign-worker.test.ts`, `marketing-topup-route.test.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `getSessionUser`, `landing-page.test.ts`, `super-admin.test.ts`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `webhook/route.ts`, `lib/campaign-worker.ts`, `rbac.ts`, `cards-index.tsx`, `merchant-card-template-service.ts`, `loyalty-program.ts`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `card-editor-canvas.tsx`, `requireMutatingRequest`, `loyalty-service.ts`, `http.ts`, `jsonOk`, `loyalty-reward-removal.ts`, `wallet-home.tsx`, `profile-page.tsx`, `employee-invitation-service.ts`, `google-auth.ts`, `jsonError`, `prisma.ts`, `loyalty-commit.ts`, `advantages-ui.tsx`, `qr/route.ts`, `create-super-admin.ts`, `campaigns/[id]/confirm/route.ts`, `card-editor.tsx`, `package.json`, `marketing-balance.ts`, `scan/ui.tsx`, `loyalty-program-publication.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `ref_next_link`, `loyalty-service.test.ts`, `platform-stats.ts`, `events/route.ts`, `loyalty-context.ts`, `types.ts`, `qr.ts`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `merchant-app-access.ts`, `programme/ui.tsx`, `requireUser`, `employee-session.ts`, `getSessionUser`, `super-admin.test.ts`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `discover-page.tsx`, `cards-index.tsx`, `merchant-card-template-service.ts`, `fife-life/merchant-detail.tsx`, `card-editor-properties.tsx`, `campaign-moderation-home.tsx`, `card-editor-canvas.tsx`, `qa-login/page.tsx`, `wallet-hydration.test.tsx`, `merchant-ui.tsx`, `wallet-home.tsx`, `use-media-query.ts`, `profile-page.tsx`, `advantages-ui.tsx`, `card-editor.tsx`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `scan/ui.tsx`, `card-enlarged-view.tsx`, `src/app/page.tsx`, `ref_next_link`, `qr-cache.ts`, `loyalty-context.ts`, `card-deck.tsx`, `[id]/merchant-detail.tsx`, `types.ts`, `layout-shell.tsx`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `programme/ui.tsx`, `notifications-center.tsx`, `cn`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _833 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `card-template-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10606060606060606 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06292966684294024 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.08305084745762711 - nodes in this community are weakly interconnected._