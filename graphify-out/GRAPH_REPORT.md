# Graph Report - Cartefidelité  (2026-09-23)

## Corpus Check
- 587 files · ~4,725,724 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 6, .example 3, .css 3)

## Summary
- 3119 nodes · 9653 edges · 147 communities (129 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 66 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9c590c8c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- merchant-reward-progress-panel.tsx
- card-template-schema.ts
- scan/ui.tsx
- merchant-card-template-service.ts
- next
- react
- insight-demo-data.ts
- ref_next_navigation
- dashboard/route.ts
- merchant-card-renderer.tsx
- loyalty-widget.ts
- validation.ts
- writeAudit
- card-editor-properties.tsx
- requireMutatingRequest
- loyalty-service.ts
- google-wallet/route.ts
- wallet-hydration.test.tsx
- cn
- use-wallet-unlock-animation.ts
- insight-period.ts
- profile-shared.tsx
- money.ts
- wallet-home.tsx
- google-auth.ts
- env.ts
- loyalty-commit.ts
- profile-page.tsx
- loyalty-program.ts
- advantages-ui.tsx
- caisse-scan.test.ts
- vitest
- requireMerchantAdmin
- card-editor.tsx
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- google-wallet.ts
- demo-session.ts
- What You Must Do When Invoked
- super-admin-session.ts
- media-storage.ts
- loyalty-commit.test.ts
- types.ts
- ref_fs_promises
- ref_next_headers
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- @prisma/client
- qr-cache.ts
- qa-login.ts
- ref_node_path
- dependencies
- isGoogleWalletConfigured
- email.ts
- devDependencies
- insight-stats.ts
- qr.ts
- demo-visual.ts
- landing-footer.tsx
- loyalty-service.test.ts
- scripts
- api-merchant-statistics-route.test.ts
- platform-stats.ts
- google-wallet-appearance.ts
- programme/ui.tsx
- loyalty-context.ts
- customer-history.ts
- webhook/route.ts
- card-deck.tsx
- [id]/merchant-detail.tsx
- MerchantCardData
- AdvantagesEditor
- SettingsPage
- customer-reward-progress.ts
- unsubscribe/route.ts
- EmployeeDetailPanel
- MerchantDetailPage
- campaign-quota.test.ts
- use-media-query.ts
- cartes.js
- Fidelo
- docker-entrypoint.sh
- create-super-admin.ts
- MerchantCardRenderer
- customer-preferences-route.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- getSuperAdminSessionUser
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
- customer-notifications-route.test.ts
- src/app/layout.tsx
- landing-header.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- jsonError
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
- CreateMerchantWizard
- customer-qr.ts
- getEmployeeSession
- campaign-confirm-route.test.ts
- verify-viewports.mjs
- landing-page.test.ts
- generate-pwa-icons.mjs
- super-admin.test.ts
- lib/campaign-worker.ts
- discover-page.tsx
- scripts/campaign-worker.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- campaign-moderation-home.tsx
- campaign-crud-routes.test.ts
- customer-qr-route.test.ts
- getSessionUser
- push-client.ts
- google-wallet-doctor.ts
- csrf.ts
- landing-merchant-preview.tsx
- employees/[id]/route.ts
- app/ui.tsx
- caisse-scan.ts
- employee-invitation-service.ts
- landing-hero-visual.tsx
- landing-faq.tsx

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 188 edges
2. `jsonOk()` - 170 edges
3. `requireMutatingRequest()` - 115 edges
4. `prisma` - 108 edges
5. `react` - 95 edges
6. `vitest` - 91 edges
7. `@prisma/client` - 90 edges
8. `clientIp()` - 88 edges
9. `userAgent()` - 84 edges
10. `readJson()` - 81 edges

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

## Communities (147 total, 18 thin omitted)

### Community 0 - "merchant-reward-progress-panel.tsx"
Cohesion: 0.18
Nodes (10): TargetBlock(), PREVIEW_CARDS, resetQrCache(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState, progressLineForTarget() (+2 more)

### Community 1 - "card-template-schema.ts"
Cohesion: 0.13
Nodes (18): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle, CardProgressColors (+10 more)

### Community 2 - "scan/ui.tsx"
Cohesion: 0.06
Nodes (63): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+55 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.05
Nodes (73): GET(), LOYALTY_MODES, GET(), JoinMerchantPage(), ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot() (+65 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "react"
Cohesion: 0.07
Nodes (29): ref_next_link, react, SettingsPanel(), Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), SPACES (+21 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.12
Nodes (40): ref_next_navigation, CaissePage(), CampagnesPage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage() (+32 more)

### Community 8 - "dashboard/route.ts"
Cohesion: 0.50
Nodes (6): GET(), resolvePeriod(), getFreeMerchantStats(), getHomeStats(), getTotalClients(), hasAnyRecordedRevenue()

### Community 9 - "merchant-card-renderer.tsx"
Cohesion: 0.06
Nodes (45): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+37 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (50): buildElementCatalog(), LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), applyEditorAutoFix(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad() (+42 more)

### Community 11 - "validation.ts"
Cohesion: 0.07
Nodes (45): POST(), GET(), PATCH(), DELETE(), POST(), POST(), GET(), PATCH() (+37 more)

### Community 12 - "writeAudit"
Cohesion: 0.14
Nodes (28): POST(), PATCH(), GET(), POST(), PATCH(), DELETE(), PATCH(), GET() (+20 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (66): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, elementLabel(), GuideLine (+58 more)

### Community 14 - "requireMutatingRequest"
Cohesion: 0.12
Nodes (46): POST(), POST(), POST(), POST(), logScanBody(), POST(), scanVia(), POST() (+38 more)

### Community 15 - "loyalty-service.ts"
Cohesion: 0.30
Nodes (11): applyAdjustment(), applyEarnVisit(), applyRedeemReward(), computeLoyalty(), LoyaltyError, LoyaltySnapshot, applyLoyaltyAction(), ApplyLoyaltyInput (+3 more)

### Community 16 - "google-wallet/route.ts"
Cohesion: 0.08
Nodes (40): zod, POST(), POST(), schema, POST(), POST(), dynamic, logCustomerQr() (+32 more)

### Community 17 - "wallet-hydration.test.tsx"
Cohesion: 0.12
Nodes (20): ref_motion_react, react-dom, ref_react_dom_client, CardsSheet(), ExpandableQrCode(), handleActivate(), openQr(), ExpandableQrCodeProps (+12 more)

### Community 18 - "cn"
Cohesion: 0.08
Nodes (34): Customer, CustomerDetailPanel(), CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel() (+26 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.12
Nodes (26): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), isDocumentVisible() (+18 more)

### Community 20 - "insight-period.ts"
Cohesion: 0.22
Nodes (19): addParisDays(), addParisMonths(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey, InsightRange (+11 more)

### Community 21 - "profile-shared.tsx"
Cohesion: 0.20
Nodes (12): APP_VERSION, APPEARANCE_OPTIONS, AppearanceRow(), demoQuery(), EditField, fieldLabels, PasswordStrength(), ProfileShell() (+4 more)

### Community 22 - "money.ts"
Cohesion: 0.12
Nodes (25): AmountField(), press(), KEYS, assertEarnProgramRules(), progressLabelFor(), RewardConfig, unitLabel(), evaluateReward() (+17 more)

### Community 23 - "wallet-home.tsx"
Cohesion: 0.07
Nodes (40): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), CustomerProgramView, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel() (+32 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "env.ts"
Cohesion: 0.09
Nodes (22): ref_next_server, env, isProduction(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost() (+14 more)

### Community 26 - "loyalty-commit.ts"
Cohesion: 0.14
Nodes (32): buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction() (+24 more)

### Community 27 - "profile-page.tsx"
Cohesion: 0.18
Nodes (15): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+7 more)

### Community 28 - "loyalty-program.ts"
Cohesion: 0.10
Nodes (33): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, EarnHistory, evaluateEarn(), formatDurationMinutes(), LoyaltyAction (+25 more)

### Community 29 - "advantages-ui.tsx"
Cohesion: 0.16
Nodes (15): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+7 more)

### Community 30 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 31 - "vitest"
Cohesion: 0.10
Nodes (13): vitest, customerMembershipFindMany, customerPreferencesFindMany, pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser, LOGO_PATH (+5 more)

### Community 32 - "requireMerchantAdmin"
Cohesion: 0.18
Nodes (29): POST(), POST(), GET(), GET(), POST(), serializeCampaign(), requireMerchantAdmin(), AudienceEstimate (+21 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.09
Nodes (29): CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction(), saveDraft() (+21 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "google-wallet.ts"
Cohesion: 0.22
Nodes (23): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), GoogleWalletImage (+15 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.15
Nodes (20): GET(), GET(), GET(), GET(), GET(), CLIENT_DEMO_COOKIE, demoCookieNamesForRole(), demoEnterTarget() (+12 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "super-admin-session.ts"
Cohesion: 0.31
Nodes (11): POST(), POST(), isSuperAdmin(), cookieOptions(), createSuperAdminSession(), destroySuperAdminSession(), getRequestSuperAdminUser(), getSuperAdminUserFromToken() (+3 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.13
Nodes (26): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig, deleteCardBackgroundIfUnused() (+18 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "types.ts"
Cohesion: 0.09
Nodes (32): CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard() (+24 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.12
Nodes (13): ref_fs_promises, ref_sharp, OUT, shots, OUT, tiers, files, INPUT_DIR (+5 more)

### Community 45 - "ref_next_headers"
Cohesion: 0.18
Nodes (15): ref_next_headers, CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled() (+7 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.12
Nodes (21): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+13 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (19): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+11 more)

### Community 49 - "@prisma/client"
Cohesion: 0.12
Nodes (29): @prisma/client, GET(), loadProgram(), POST(), activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements() (+21 more)

### Community 50 - "qr-cache.ts"
Cohesion: 0.20
Nodes (15): QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr(), getCachedQr(), getPersonalizedQr(), inflight (+7 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (35): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken() (+27 more)

### Community 52 - "ref_node_path"
Cohesion: 0.06
Nodes (21): ref_node_fs_promises, ref_node_path, playwright, OUT, OUT, shots, outDir, outDir (+13 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "isGoogleWalletConfigured"
Cohesion: 0.15
Nodes (28): isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue() (+20 more)

### Community 55 - "email.ts"
Cohesion: 0.22
Nodes (15): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+7 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.11
Nodes (32): bucketKey(), enumerateBucketKeys(), percentChange(), buildCohorts(), buildComparison(), buildFinancial(), buildFrequentation(), buildOverview() (+24 more)

### Community 58 - "qr.ts"
Cohesion: 0.25
Nodes (11): main(), prisma, requiredEnv(), upsertEmployee(), processCaisseScan(), assertQrUsable(), QrError, QrPayload (+3 more)

### Community 59 - "demo-visual.ts"
Cohesion: 0.17
Nodes (10): PREVIEW_PREFERENCES, PREVIEW_PROFILE, DEMO_EMAIL, DEMO_EMPLOYEE, DEMO_FIRST_NAME, DEMO_FULL_NAME, DEMO_LAST_NAME, DEMO_POINTS (+2 more)

### Community 60 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 64 - "platform-stats.ts"
Cohesion: 0.24
Nodes (14): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+6 more)

### Community 65 - "google-wallet-appearance.ts"
Cohesion: 0.16
Nodes (15): GET(), GET(), notFound(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS, GoogleWalletAppearance, googleWalletAppearanceSchema, googleWalletButtonLabelSchema (+7 more)

### Community 66 - "programme/ui.tsx"
Cohesion: 0.17
Nodes (13): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+5 more)

### Community 67 - "loyalty-context.ts"
Cohesion: 0.13
Nodes (21): ref_react_dom_server, dynamic, MerchantProfilePage(), formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl() (+13 more)

### Community 68 - "customer-history.ts"
Cohesion: 0.32
Nodes (6): BenefitEntry, formatLoyaltyEntry(), HistoryCategory, HistoryEntry, mapLoyaltyCategory(), mapLoyaltyTone()

### Community 69 - "webhook/route.ts"
Cohesion: 0.09
Nodes (30): stripe, handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), POST(), isCancellable() (+22 more)

### Community 70 - "card-deck.tsx"
Cohesion: 0.20
Nodes (12): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+4 more)

### Community 71 - "[id]/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+10 more)

### Community 72 - "MerchantCardData"
Cohesion: 0.12
Nodes (9): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList(), ProgramPreviewCard() (+1 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

### Community 75 - "customer-reward-progress.ts"
Cohesion: 0.11
Nodes (37): main(), dynamic, GET(), dynamic, GET(), GET(), sortOrder(), CarteIndexPage() (+29 more)

### Community 76 - "unsubscribe/route.ts"
Cohesion: 0.16
Nodes (15): jose, bodySchema, POST(), CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField, recordConsentEvents(), secretKey() (+7 more)

### Community 77 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fidelo"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fidelo, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 85 - "MerchantCardRenderer"
Cohesion: 0.19
Nodes (23): ref_node_fs, MerchantCardRenderer(), resolveDisplayQrSrc(), defaultCardTemplateConfig(), CUSTOMER_QR_DATA_KEY, isQrTemplateElement(), listQrTemplateElements(), normalizeQrTemplateElement() (+15 more)

### Community 86 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "getSuperAdminSessionUser"
Cohesion: 0.06
Nodes (32): recharts, SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminCardsPage() (+24 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.05
Nodes (26): AD_STATUS_LABELS, addDaysToDateInput(), AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampagnesPanel(), CAMPAIGN_PRICE_CENTS (+18 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "ref_path"
Cohesion: 0.11
Nodes (15): ref_fs, ref_path, ref_vitest_config, main(), outDir, shot(), outDir, main() (+7 more)

### Community 102 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 103 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.15
Nodes (10): ref_next_font_google, next-themes, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister() (+2 more)

### Community 105 - "landing-header.tsx"
Cohesion: 0.33
Nodes (5): MoonIcon(), SunIcon(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "jsonError"
Cohesion: 0.08
Nodes (44): GET(), PATCH(), GET(), POST(), POST(), GET(), GET(), DELETE() (+36 more)

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
Nodes (20): GET(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession (+12 more)

### Community 120 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 121 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

### Community 122 - "getEmployeeSession"
Cohesion: 0.15
Nodes (10): EmployeeLoginPage(), EmployeeLoginScreen(), onSubmit(), readApiJson(), ProEntryPage(), SPACES, getEmployeeSession(), LandingAuthTargets (+2 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.13
Nodes (15): baseCampaign, campaignFindFirst, campaignPaymentCreate, campaignUpdate, createCampaignCheckoutSession, estimateMerchantMembersAudience, estimateNetworkLocalAudience, FakeStripeNotConfiguredError (+7 more)

### Community 125 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 126 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 127 - "super-admin.test.ts"
Cohesion: 0.16
Nodes (15): ref_os, BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr() (+7 more)

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.32
Nodes (11): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+3 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.27
Nodes (5): DiscoverPage(), Merchant, Sponsored, SponsoredAd, SponsoredBanner()

### Community 132 - "scripts/campaign-worker.ts"
Cohesion: 0.70
Nodes (4): log(), loop(), requestShutdown(), sleep()

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.20
Nodes (8): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 134 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 135 - "campaign-moderation-home.tsx"
Cohesion: 0.22
Nodes (6): AdRequest, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget, SuperAdminCampagnesPage()

### Community 136 - "campaign-crud-routes.test.ts"
Cohesion: 0.22
Nodes (7): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 137 - "customer-qr-route.test.ts"
Cohesion: 0.29
Nodes (5): generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug

### Community 138 - "getSessionUser"
Cohesion: 0.26
Nodes (13): CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_HISTORY, PREVIEW_PROFILE_HISTORY, getProfileUser(), src_lib_demo_visual_client_demo_cookie (+5 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "google-wallet-doctor.ts"
Cohesion: 0.52
Nodes (6): google-auth-library, accessToken(), fail(), main(), ok(), pngSize()

### Community 142 - "csrf.ts"
Cohesion: 0.60
Nodes (3): assertSameOrigin(), CsrfError, getAllowedOrigins()

### Community 143 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 144 - "employees/[id]/route.ts"
Cohesion: 0.13
Nodes (26): POST(), schema, GET(), POST(), DELETE(), GET(), mapEmployee(), PATCH() (+18 more)

### Community 147 - "app/ui.tsx"
Cohesion: 0.25
Nodes (5): HomeStats, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 149 - "caisse-scan.ts"
Cohesion: 0.25
Nodes (11): buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScanByClientNumber(), deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber() (+3 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.13
Nodes (23): GET(), POST(), employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken() (+15 more)

### Community 152 - "landing-hero-visual.tsx"
Cohesion: 0.33
Nodes (5): CoffeeIcon(), QrCodeIcon(), WalletCardsIcon(), WifiIcon(), LandingHeroVisual()

### Community 153 - "landing-faq.tsx"
Cohesion: 0.40
Nodes (4): PlusIcon(), FAQ_ITEMS, FaqItem, LandingFaq()

## Knowledge Gaps
- **758 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+753 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1024 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `@prisma/client` to `merchant-reward-progress-panel.tsx`, `lib/campaign-worker.ts`, `scan/ui.tsx`, `merchant-card-template-service.ts`, `ref_next_navigation`, `merchant-card-renderer.tsx`, `loyalty-widget.ts`, `validation.ts`, `writeAudit`, `card-editor-properties.tsx`, `loyalty-service.ts`, `google-wallet/route.ts`, `employees/[id]/route.ts`, `use-wallet-unlock-animation.ts`, `employee-invitation-service.ts`, `wallet-home.tsx`, `google-auth.ts`, `money.ts`, `loyalty-commit.ts`, `env.ts`, `loyalty-program.ts`, `advantages-ui.tsx`, `requireMerchantAdmin`, `card-editor.tsx`, `package.json`, `google-wallet.ts`, `super-admin-session.ts`, `types.ts`, `qa-login.ts`, `insight-stats.ts`, `qr.ts`, `loyalty-service.test.ts`, `platform-stats.ts`, `programme/ui.tsx`, `loyalty-context.ts`, `customer-history.ts`, `webhook/route.ts`, `MerchantCardData`, `customer-reward-progress.ts`, `unsubscribe/route.ts`, `create-super-admin.ts`, `MerchantCardRenderer`, `getSuperAdminSessionUser`, `jsonError`, `employee-session.ts`, `customer-qr.ts`, `super-admin.test.ts`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `merchant-reward-progress-panel.tsx`, `scan/ui.tsx`, `merchant-card-template-service.ts`, `react`, `super-admin-campaign-moderation.test.ts`, `ref_next_navigation`, `campaign-crud-routes.test.ts`, `customer-qr-route.test.ts`, `loyalty-widget.ts`, `dashboard/route.ts`, `push-client.ts`, `card-editor-properties.tsx`, `merchant-card-renderer.tsx`, `loyalty-service.ts`, `employees/[id]/route.ts`, `wallet-hydration.test.tsx`, `use-wallet-unlock-animation.ts`, `insight-period.ts`, `caisse-scan.ts`, `employee-invitation-service.ts`, `wallet-home.tsx`, `google-auth.ts`, `env.ts`, `loyalty-commit.ts`, `money.ts`, `loyalty-program.ts`, `profile-shared.tsx`, `caisse-scan.test.ts`, `requireMerchantAdmin`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `@prisma/client`, `qa-login.ts`, `email.ts`, `qr.ts`, `loyalty-service.test.ts`, `api-merchant-statistics-route.test.ts`, `platform-stats.ts`, `loyalty-context.ts`, `webhook/route.ts`, `card-deck.tsx`, `customer-reward-progress.ts`, `unsubscribe/route.ts`, `campaign-quota.test.ts`, `MerchantCardRenderer`, `customer-preferences-route.test.ts`, `ref_path`, `caisse-scan-route.test.ts`, `customer-notifications-route.test.ts`, `campaign-worker.test.ts`, `getEmployeeSession`, `campaign-confirm-route.test.ts`, `landing-page.test.ts`, `super-admin.test.ts`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `merchant-reward-progress-panel.tsx`, `card-template-schema.ts`, `scan/ui.tsx`, `merchant-card-template-service.ts`, `discover-page.tsx`, `campaign-moderation-home.tsx`, `merchant-card-renderer.tsx`, `card-editor-properties.tsx`, `wallet-hydration.test.tsx`, `cn`, `app/ui.tsx`, `use-wallet-unlock-animation.ts`, `profile-shared.tsx`, `wallet-home.tsx`, `landing-faq.tsx`, `profile-page.tsx`, `advantages-ui.tsx`, `card-editor.tsx`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `types.ts`, `wallet-event-dedup.ts`, `qr-cache.ts`, `qa-login.ts`, `programme/ui.tsx`, `loyalty-context.ts`, `card-deck.tsx`, `[id]/merchant-detail.tsx`, `MerchantCardData`, `use-media-query.ts`, `getSuperAdminSessionUser`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `landing-header.tsx`, `notifications-center.tsx`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _758 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `card-template-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12554112554112554 - nodes in this community are weakly interconnected._
- **Should `scan/ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05925925925925926 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04911180773249739 - nodes in this community are weakly interconnected._