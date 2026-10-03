# Graph Report - Cartefidelité  (2026-10-03)

## Corpus Check
- 722 files · ~4,807,486 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 4010 nodes · 12527 edges · 189 communities (153 shown, 36 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29da23b8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- loyalty-labels.ts
- merchant-app-access.ts
- merchant-card-template-service.ts
- ouvrir/route.ts
- react
- loyalty-commit.ts
- card-editor-properties.tsx
- google-wallet/route.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-canvas.tsx
- jsonOk
- buildGoogleWalletMerchantView
- stripe.ts
- insight-period.ts
- [id]/merchant-detail.tsx
- ad-visual-workflow.ts
- clients/ui.tsx
- prisma.ts
- money.ts
- google-wallet.ts
- google-auth.ts
- middleware.ts
- jsonError
- rateLimit
- fiche.tsx
- staff-permissions.ts
- customer-reward-progress.ts
- create-super-admin.ts
- programme/ui.tsx
- card-editor.tsx
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- customer-onboarding.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- CardEditorBackgroundCrop
- loyalty-service.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- card-editor-polish.test.ts
- @prisma/client
- super-admin.test.ts
- qa-login.ts
- ref_node_path
- dependencies
- loyalty-context.ts
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- sponsored-test-broadcast.ts
- wallet-home.tsx
- employee-session.ts
- scripts
- facturation/ui.tsx
- platform-stats.ts
- demo-mode.ts
- types.ts
- ref_fs
- requireMerchantAdmin
- stripe-webhook-route.test.ts
- fake-ad-db.ts
- session.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- advantages-ui.tsx
- qr-cache.ts
- unsubscribe/route.ts
- marketing-topup-route.test.ts
- ads/[id]/confirm/route.ts
- isGoogleSignInEnabled
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- cashier-checkout.tsx
- next
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- consent.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- customer-loyalty-overview.ts
- MerchantCampaignFiche
- src/app/layout.tsx
- cn
- generate-pwa-icons.mjs
- graphify reference: query, path, explain
- campaign-worker.test.ts
- layout-shell.tsx
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- env.ts
- ad-confirm-route.test.ts
- use-wallet-unlock-animation.ts
- campaign-confirm-route.test.ts
- sponsored-placements.test.ts
- getEmployeeSession
- customer-layout-guard.ts
- sponsored-hours-pricing.ts
- CardDeck
- caisse-client-number.test.ts
- merchant-ui.tsx
- app/ui.tsx
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- MerchantDetailPage
- vitest
- landing-page.test.ts
- isProduction
- google-wallet-campaign-module.ts
- push-client.ts
- campaign-moderation-home.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- ref_crypto
- [kind]/route.ts
- FinalisationForm
- campaign-test-mode-isolation.test.ts
- loyalty-service.test.ts
- google-wallet-doctor.ts
- merchant-roulette.tsx
- employee-invitation-service.ts
- profile-page.tsx
- stripe-webhook-marketing.test.ts
- employe/layout.tsx
- sponsored-slot.tsx
- send/route.ts
- lib/campaign-worker.ts
- AdDetailPage
- push.ts
- campaign-audience.test.ts
- ad-detail.tsx
- caisse-scan.test.ts
- qr.ts
- super-admin/layout.tsx
- assertCanAddEmployee
- cards-index.tsx
- sponsored-selection.ts
- api-merchant-statistics-route.test.ts
- Card
- insight-demo-data.ts
- card-template-schema.ts
- resolveMediaFilePath
- EmployeeLoginScreen
- trim-card-images.mjs
- use-media-query.ts
- avatar-storage.ts
- ref_fs_promises
- ref_motion_react
- ref_next_font_google
- ref_next_headers
- ref_next_link
- ref_next_navigation
- ref_next_server
- ref_node_fs_promises
- ref_react_dom_client
- ref_react_dom_server
- ref_vitest_config

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 261 edges
2. `jsonOk()` - 227 edges
3. `next` - 163 edges
4. `requireMutatingRequest()` - 163 edges
5. `prisma` - 148 edges
6. `vitest` - 124 edges
7. `clientIp()` - 119 edges
8. `react` - 114 edges
9. `readJson()` - 114 edges
10. `userAgent()` - 108 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveStripeMode()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `isPaymentAllowedForMerchant()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `approvedAd()` --calls--> `PATCH()`  [EXTRACTED]
  tests/campaign-fixes.test.ts → src/app/api/merchant/ads/[id]/route.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (189 total, 36 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.12
Nodes (25): logScanBody(), POST(), scanVia(), buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan() (+17 more)

### Community 1 - "loyalty-labels.ts"
Cohesion: 0.13
Nodes (29): formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot (+21 more)

### Community 2 - "merchant-app-access.ts"
Cohesion: 0.16
Nodes (16): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, MerchantAppAccess, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace() (+8 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (61): LegacyCardEditorRedirect(), CardEditorVariantRoute(), MerchantCardsGallery(), slotStatusLabel(), slotTone(), statusBadgeClass(), defaultCardTemplateConfig(), ALL_MERCHANT_CARD_SLOTS (+53 more)

### Community 4 - "ouvrir/route.ts"
Cohesion: 0.17
Nodes (13): log(), loop(), requestShutdown(), sleep(), GET(), GET(), computeAdLifecycleStatus(), runAdLifecycleTick() (+5 more)

### Community 5 - "react"
Cohesion: 0.09
Nodes (28): react, SettingsPanel(), Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), recoverMessage(), EmployeeInvitationScreen() (+20 more)

### Community 6 - "loyalty-commit.ts"
Cohesion: 0.08
Nodes (52): appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive(), loadEarnHistory() (+44 more)

### Community 7 - "card-editor-properties.tsx"
Cohesion: 0.14
Nodes (21): CardEditorProperties(), REQUIRED_BY_SLOT, TEXT_TYPES, qrOverlapsOthers(), BACKGROUND_FIT_LABELS, DATA_KEY_LABELS, dataKeyLabel(), elementTypeLabel() (+13 more)

### Community 8 - "google-wallet/route.ts"
Cohesion: 0.14
Nodes (24): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+16 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.10
Nodes (22): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct(), ProgressCircle() (+14 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (42): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel(), summarizeEditorValidation() (+34 more)

### Community 11 - "validation.ts"
Cohesion: 0.04
Nodes (52): zod, POST(), schema, GET(), markReadSchema, DELETE(), deleteSchema, markCustomerProfileFinalized() (+44 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.11
Nodes (40): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+32 more)

### Community 14 - "jsonOk"
Cohesion: 0.10
Nodes (79): POST(), POST(), POST(), POST(), POST(), POST(), POST(), POST() (+71 more)

### Community 15 - "buildGoogleWalletMerchantView"
Cohesion: 0.28
Nodes (16): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData() (+8 more)

### Community 16 - "stripe.ts"
Cohesion: 0.05
Nodes (79): stripe, GET(), schema, GET(), POST(), GET(), handleChargeRefunded(), handleCheckoutSessionCompleted() (+71 more)

### Community 17 - "insight-period.ts"
Cohesion: 0.23
Nodes (20): addParisDays(), addParisMonths(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey, PARIS_TZ (+12 more)

### Community 18 - "[id]/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+10 more)

### Community 19 - "ad-visual-workflow.ts"
Cohesion: 0.11
Nodes (31): GET(), GET(), PATCH(), GET(), AdDayStats, AdPlacementStats, AdStats, ctrOf() (+23 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "prisma.ts"
Cohesion: 0.08
Nodes (35): POST(), schema, GET(), DELETE(), FILTER_MAP, GET(), schema, dynamic (+27 more)

### Community 22 - "money.ts"
Cohesion: 0.19
Nodes (15): AmountField(), press(), KEYS, assertEarnProgramRules(), employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), eurosToCents() (+7 more)

### Community 23 - "google-wallet.ts"
Cohesion: 0.15
Nodes (34): isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue() (+26 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.14
Nodes (24): GET(), GET(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie(), encodeStateCookie(), GOOGLE_SCOPES, GoogleAuthIntent (+16 more)

### Community 25 - "middleware.ts"
Cohesion: 0.23
Nodes (17): hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), legacyRedirectOrigin() (+9 more)

### Community 26 - "jsonError"
Cohesion: 0.09
Nodes (36): GET(), PATCH(), GET(), POST(), GET(), GET(), GET(), GET() (+28 more)

### Community 27 - "rateLimit"
Cohesion: 0.11
Nodes (26): schema, POST(), POST(), POST(), dynamic, logCustomerQr(), POST(), runtime (+18 more)

### Community 28 - "fiche.tsx"
Cohesion: 0.12
Nodes (19): AdStatus, Detail, euros(), HistoryRow, PaymentPreview, PayMethod, STATUS_LABELS, block (+11 more)

### Community 29 - "staff-permissions.ts"
Cohesion: 0.13
Nodes (14): GET(), EmployeeScanPage(), requireEmployee(), DEMO_EMPLOYEE, ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS, EMPLOYEE_FIXED_PERMISSIONS (+6 more)

### Community 30 - "customer-reward-progress.ts"
Cohesion: 0.11
Nodes (29): MerchantRewardProgressPanel(), TargetBlock(), buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT (+21 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "programme/ui.tsx"
Cohesion: 0.14
Nodes (15): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+7 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.10
Nodes (33): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+25 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.11
Nodes (29): GET(), GET(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES, AD_VISUAL_MAX_PX, AD_VISUAL_MIN_PX, AD_VISUAL_RATIO (+21 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.15
Nodes (22): authenticateCustomerWithPassword(), beginCustomerOnboarding(), buildEmailVerificationUrl(), CustomerAccessLevel, CustomerOnboardingUser, customerPostAuthRedirect(), FINALIZATION_PATH_PREFIXES, FINALIZATION_REMINDER_MS (+14 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.13
Nodes (33): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+25 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.15
Nodes (24): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig, deleteCardBackgroundIfUnused() (+16 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 44 - "loyalty-service.ts"
Cohesion: 0.14
Nodes (21): GET(), GET(), sortOrder(), GET(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), balanceFieldForUnit() (+13 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.19
Nodes (16): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), applyDemoRoleCookies() (+8 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.06
Nodes (43): next-themes, BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS (+35 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "card-editor-polish.test.ts"
Cohesion: 0.16
Nodes (21): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, containsForbiddenTechnicalLabel(), qrVisuallySquareInPixels(), CardTemplateConfig, canUseSessionStorage() (+13 more)

### Community 49 - "@prisma/client"
Cohesion: 0.13
Nodes (28): @prisma/client, loadProgram(), POST(), activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward (+20 more)

### Community 50 - "super-admin.test.ts"
Cohesion: 0.17
Nodes (16): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+8 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.10
Nodes (31): assertNoUnknownArgs(), main(), parseTtlMinutes(), dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), assertQaLoginTtlMinutes() (+23 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (37): ref_node_fs, ref_node_path, ref_node_url, playwright, outDir, pages, OUT, OUT (+29 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "loyalty-context.ts"
Cohesion: 0.14
Nodes (30): main(), dynamic, GET(), GET(), LOYALTY_MODES, GET(), CarteIndexPage(), dynamic (+22 more)

### Community 55 - "email.ts"
Cohesion: 0.19
Nodes (25): nodemailer, ContactPage(), buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput, emailConfigHint() (+17 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.10
Nodes (36): bucketKey(), enumerateBucketKeys(), InsightRange, buildCohorts(), buildComparison(), buildFinancial(), buildFrequentation(), buildOverview() (+28 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.11
Nodes (10): MobilePlacementPreview(), resetSponsoredSessionState(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer (+2 more)

### Community 59 - "sponsored-test-broadcast.ts"
Cohesion: 0.13
Nodes (28): DELETE(), GET(), POST(), publicGoogleWalletError(), adToGlobalWalletTestModule(), adToSponsoredTestCard(), BroadcastAd, getSponsoredTestBroadcastAdId() (+20 more)

### Community 60 - "wallet-home.tsx"
Cohesion: 0.07
Nodes (29): motion, react-dom, AddToGoogleWalletButton(), CardsSheet(), DiscoverPage(), Merchant, ExpandableQrCode(), handleActivate() (+21 more)

### Community 61 - "employee-session.ts"
Cohesion: 0.21
Nodes (15): EmployeeLoginPage(), canEmployeeAccess(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason() (+7 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.29
Nodes (12): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), getSponsoredAdsStats() (+4 more)

### Community 65 - "demo-mode.ts"
Cohesion: 0.15
Nodes (17): CaisseAliasPage(), EmployeeHomePage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE (+9 more)

### Community 66 - "types.ts"
Cohesion: 0.08
Nodes (35): DeckItem, demoStartIndex(), CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode (+27 more)

### Community 67 - "ref_fs"
Cohesion: 0.07
Nodes (19): ref_fs, ref_path, main(), outDir, shot(), outDir, main(), outDir (+11 more)

### Community 68 - "requireMerchantAdmin"
Cohesion: 0.12
Nodes (24): GET(), GET(), POST(), DELETE(), GET(), loadOwnedCampaign(), PATCH(), GET() (+16 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "fake-ad-db.ts"
Cohesion: 0.11
Nodes (20): END, fake, h, previewCall(), START, END, fake, START (+12 more)

### Community 71 - "session.ts"
Cohesion: 0.08
Nodes (42): GET(), GET(), dynamic, MerchantProfilePage(), CarteAvantagesPage(), dynamic, CarteIdentitePage(), AccountPage() (+34 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.10
Nodes (39): MerchantCardPublicPreview(), COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps (+31 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "advantages-ui.tsx"
Cohesion: 0.15
Nodes (17): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+9 more)

### Community 75 - "qr-cache.ts"
Cohesion: 0.14
Nodes (18): PREVIEW_CARDS, QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr(), getCachedQr(), getPersonalizedQr() (+10 more)

### Community 76 - "unsubscribe/route.ts"
Cohesion: 0.21
Nodes (12): jose, bodySchema, POST(), recordConsentEvents(), secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeTokenError (+4 more)

### Community 77 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 78 - "ads/[id]/confirm/route.ts"
Cohesion: 0.10
Nodes (47): billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, POST() (+39 more)

### Community 79 - "isGoogleSignInEnabled"
Cohesion: 0.18
Nodes (11): AppLoginPage(), CustomerLoginPage(), CustomerSignupPage(), CustomerSignupForm(), isGoogleAuthConfigured(), isGoogleSignInEnabled(), formatEurosFromCents(), isMerchantPlanId() (+3 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.08
Nodes (27): AuditPage(), SuperAdminAuditPage(), DiagnosticPage(), SuperAdminDiagnosticPage(), SuperAdminAdDetailPage(), SuperAdminCampagnesPage(), SuperAdminCardsPage(), MerchantCardsPage() (+19 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "cashier-checkout.tsx"
Cohesion: 0.26
Nodes (12): CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase, RewardCard(), statusClass(), commitCaisseTransaction() (+4 more)

### Community 85 - "next"
Cohesion: 0.12
Nodes (32): nextConfig, next, CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage() (+24 more)

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.14
Nodes (15): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, h, jsonRequest() (+7 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "consent.ts"
Cohesion: 0.50
Nodes (3): CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.05
Nodes (38): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), AD_STATUS_LABELS, AdRequest, AdStatus (+30 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "customer-loyalty-overview.ts"
Cohesion: 0.09
Nodes (30): CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard(), notifyMerchantRewardProgressRefresh() (+22 more)

### Community 102 - "MerchantCampaignFiche"
Cohesion: 0.35
Nodes (10): api(), MerchantCampaignFiche(), addSources(), onFile(), onFramed(), post(), onFileChosen(), isExactBanner() (+2 more)

### Community 103 - "src/app/layout.tsx"
Cohesion: 0.15
Nodes (8): src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR, ThemeProvider()

### Community 104 - "cn"
Cohesion: 0.13
Nodes (14): DashboardLayout(), CreateMerchantWizard(), goNext(), stepError(), AppNav(), icons, isActive(), TOOLS_PREFIXES (+6 more)

### Community 105 - "generate-pwa-icons.mjs"
Cohesion: 0.28
Nodes (8): ref_node_buffer, ref_node_zlib, chunk(), color, crc32(), outDir, png(), root

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "layout-shell.tsx"
Cohesion: 0.09
Nodes (20): recharts, SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), Check, Item, ACTIVITY_LABELS (+12 more)

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
Cohesion: 0.24
Nodes (8): DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter(), markOneRead(), openNotification()

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "env.ts"
Cohesion: 0.12
Nodes (8): dynamic, robots(), dynamic, sitemap(), assertSameOrigin(), CsrfError, env, getAllowedOrigins()

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "use-wallet-unlock-animation.ts"
Cohesion: 0.11
Nodes (30): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), WalletEventPayload (+22 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-placements.test.ts"
Cohesion: 0.14
Nodes (20): POST(), schema, GET(), previewResponse(), withResolvedImage(), resolveSponsoredImageUrl(), loadAdPreviewCard(), parsePlacement() (+12 more)

### Community 125 - "getEmployeeSession"
Cohesion: 0.15
Nodes (12): ProEntryPage(), SPACES, FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS (+4 more)

### Community 126 - "customer-layout-guard.ts"
Cohesion: 0.36
Nodes (6): CarteLayout(), CompteLayout(), NotificationsLayout(), enforceCustomerWalletAccess(), customerWalletGuardRedirect(), isFinalizationAllowedPath()

### Community 127 - "sponsored-hours-pricing.ts"
Cohesion: 0.10
Nodes (29): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), formatHourRange(), HourlySchedulePicker(), addDay(), hourSelectOptions(), hoursToSlots() (+21 more)

### Community 128 - "CardDeck"
Cohesion: 0.21
Nodes (10): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), readDeckMetrics(), CARD_NO_EXPAND_SELECTOR (+2 more)

### Community 129 - "caisse-client-number.test.ts"
Cohesion: 0.22
Nodes (9): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique, userFindFirst (+1 more)

### Community 130 - "merchant-ui.tsx"
Cohesion: 0.09
Nodes (24): DEMO, Employee, EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend() (+16 more)

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.18
Nodes (17): GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), canExposeInvitationLinkInAdmin(), createDirectEmployee() (+9 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 135 - "vitest"
Cohesion: 0.04
Nodes (35): vitest, campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique, inAppNotificationCount, inAppNotificationFindMany (+27 more)

### Community 136 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 137 - "isProduction"
Cohesion: 0.27
Nodes (7): isProduction(), assertSuperAdminProductionConfig(), isSuperAdminAllowedEmailsConfigured(), setSuperAdminEntryCookie(), SUPER_ADMIN_ENTRY_COOKIE, superAdminEntryCookieOptions(), loadMiddleware()

### Community 138 - "google-wallet-campaign-module.ts"
Cohesion: 0.46
Nodes (6): buildGlobalWalletValueAddedModule(), globalWalletCampaignDetailUri(), GlobalWalletCampaignModule, localized(), publicCampaignImageUrl(), walletHttpsUri()

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.26
Nodes (13): approvedAd(), asAdmin(), asMerchant(), ctx(), dataUrl(), fake, futureSchedule(), h (+5 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.21
Nodes (9): adminStage(), createAd(), ctx(), fake, h, jsonReq(), merchantStage(), moderate() (+1 more)

### Community 143 - "ref_crypto"
Cohesion: 0.47
Nodes (5): ref_crypto, installQaMocks(), loadQaLogin(), sha256(), state

### Community 144 - "[kind]/route.ts"
Cohesion: 0.24
Nodes (5): ref_os, GET(), notFound(), loadRoute(), PNG_BYTES

### Community 146 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 148 - "google-wallet-doctor.ts"
Cohesion: 0.39
Nodes (8): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl(), publicUrl()

### Community 149 - "merchant-roulette.tsx"
Cohesion: 0.38
Nodes (3): LinearGauge(), MerchantFace(), MerchantRoulette()

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.17
Nodes (19): GET(), POST(), buildInvitationLink(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired() (+11 more)

### Community 151 - "profile-page.tsx"
Cohesion: 0.08
Nodes (35): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+27 more)

### Community 152 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.22
Nodes (12): IMAGE_CLASS, SponsoredAd, SponsoredBanner(), SponsoredVariant, getDismissedAds(), rememberDismissed(), reportedThisSession, SponsoredPlacement (+4 more)

### Community 155 - "send/route.ts"
Cohesion: 0.29
Nodes (12): POST(), FinalisationPage(), createRawCustomerToken(), CUSTOMER_TOKEN_TTL, invalidateCustomerAccessTokens(), issueCustomerAccessToken(), requestAccountRecovery(), isSmsConfigured() (+4 more)

### Community 156 - "lib/campaign-worker.ts"
Cohesion: 0.19
Nodes (16): AudienceEstimate, estimatedForChannel(), estimateNetworkLocalAudience(), networkAudienceWhere(), backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete() (+8 more)

### Community 157 - "AdDetailPage"
Cohesion: 0.29
Nodes (11): AdDetailPage(), confirmReason(), patch(), requestSend(), run(), sendProposal(), startTestBroadcast(), stopTestBroadcast() (+3 more)

### Community 158 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 160 - "ad-detail.tsx"
Cohesion: 0.10
Nodes (20): AdRequestDetail, AdStatus, AUDIT_LABELS, AuditRow, Delivery, Draft, formatCents(), formatDay() (+12 more)

### Community 161 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 162 - "qr.ts"
Cohesion: 0.17
Nodes (17): main(), prisma, requiredEnv(), upsertEmployee(), qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+9 more)

### Community 165 - "cards-index.tsx"
Cohesion: 0.31
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.12
Nodes (28): main(), AdCandidate, CustomerZone, DeliveryCheck, diagnoseAdDelivery(), evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS (+20 more)

### Community 167 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 169 - "Card"
Cohesion: 0.14
Nodes (5): metadata, ContactForm(), SPACES, BrandMark(), Card()

### Community 173 - "card-template-schema.ts"
Cohesion: 0.10
Nodes (27): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), CARD_SCHEMA_VERSION, CardDecorativeStyle (+19 more)

### Community 175 - "resolveMediaFilePath"
Cohesion: 0.38
Nodes (5): GET(), MIME, GET(), MIME, resolveMediaFilePath()

### Community 176 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 178 - "trim-card-images.mjs"
Cohesion: 0.40
Nodes (3): ref_sharp, files, INPUT_DIR

### Community 181 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

## Knowledge Gaps
- **1010 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+1005 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1361 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `caisse-scan.ts`, `loyalty-labels.ts`, `merchant-app-access.ts`, `app/ui.tsx`, `ouvrir/route.ts`, `react`, `merchant-card-template-service.ts`, `merchant-ui.tsx`, `vitest`, `isProduction`, `super-admin-campaign-moderation.test.ts`, `campaign-moderation-home.tsx`, `jsonOk`, `[id]/merchant-detail.tsx`, `clients/ui.tsx`, `prisma.ts`, `profile-page.tsx`, `google-auth.ts`, `employe/layout.tsx`, `middleware.ts`, `send/route.ts`, `staff-permissions.ts`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `super-admin/layout.tsx`, `ad-visuals.ts`, `cards-index.tsx`, `api-merchant-statistics-route.test.ts`, `health/route.ts`, `scan/ui.tsx`, `Card`, `manifest.ts`, `demo-session.ts`, `src/app/page.tsx`, `resolveMediaFilePath`, `qa-login.ts`, `ref_node_path`, `loyalty-context.ts`, `wallet-home.tsx`, `employee-session.ts`, `demo-mode.ts`, `types.ts`, `ref_fs`, `session.ts`, `merchant-card-renderer.tsx`, `advantages-ui.tsx`, `unsubscribe/route.ts`, `marketing-topup-route.test.ts`, `super-admin-session.ts`, `campagnes/ui.tsx`, `customer-loyalty-overview.ts`, `src/app/layout.tsx`, `cn`, `layout-shell.tsx`, `notifications-center.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `getEmployeeSession`, `customer-layout-guard.ts`?**
  _High betweenness centrality (0.203) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `loyalty-labels.ts`, `merchant-app-access.ts`, `merchant-card-template-service.ts`, `ouvrir/route.ts`, `react`, `loyalty-commit.ts`, `google-wallet/route.ts`, `loyalty-widget.ts`, `card-editor-canvas.tsx`, `stripe.ts`, `insight-period.ts`, `prisma.ts`, `money.ts`, `google-auth.ts`, `middleware.ts`, `customer-reward-progress.ts`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `customer-onboarding.ts`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `loyalty-service.ts`, `card-editor-polish.test.ts`, `@prisma/client`, `super-admin.test.ts`, `ref_node_path`, `loyalty-context.ts`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `sponsored-test-broadcast.ts`, `wallet-home.tsx`, `platform-stats.ts`, `ref_fs`, `requireMerchantAdmin`, `stripe-webhook-route.test.ts`, `fake-ad-db.ts`, `merchant-card-renderer.tsx`, `qr-cache.ts`, `unsubscribe/route.ts`, `marketing-topup-route.test.ts`, `ads/[id]/confirm/route.ts`, `isGoogleSignInEnabled`, `super-admin-session.ts`, `next`, `ad-visual-journeys.test.ts`, `customer-loyalty-overview.ts`, `src/app/layout.tsx`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `use-wallet-unlock-animation.ts`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`, `getEmployeeSession`, `CardDeck`, `caisse-client-number.test.ts`, `employees/[id]/route.ts`, `super-admin-campaign-moderation.test.ts`, `landing-page.test.ts`, `isProduction`, `google-wallet-campaign-module.ts`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `ref_crypto`, `[kind]/route.ts`, `campaign-test-mode-isolation.test.ts`, `loyalty-service.test.ts`, `employee-invitation-service.ts`, `stripe-webhook-marketing.test.ts`, `lib/campaign-worker.ts`, `campaign-audience.test.ts`, `caisse-scan.test.ts`, `qr.ts`, `assertCanAddEmployee`, `api-merchant-statistics-route.test.ts`, `card-template-schema.ts`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `loyalty-labels.ts`, `merchant-app-access.ts`, `merchant-card-template-service.ts`, `ouvrir/route.ts`, `employees/[id]/route.ts`, `loyalty-commit.ts`, `card-editor-properties.tsx`, `loyalty-widget.ts`, `card-editor-canvas.tsx`, `jsonOk`, `stripe.ts`, `ad-visual-workflow.ts`, `loyalty-service.test.ts`, `prisma.ts`, `employee-invitation-service.ts`, `profile-page.tsx`, `google-auth.ts`, `google-wallet.ts`, `jsonError`, `send/route.ts`, `lib/campaign-worker.ts`, `staff-permissions.ts`, `customer-reward-progress.ts`, `create-super-admin.ts`, `programme/ui.tsx`, `card-editor.tsx`, `qr.ts`, `package.json`, `cards-index.tsx`, `customer-onboarding.ts`, `sponsored-selection.ts`, `loyalty-service.ts`, `super-admin.test.ts`, `qa-login.ts`, `loyalty-context.ts`, `insight-stats.ts`, `sponsored-test-broadcast.ts`, `wallet-home.tsx`, `employee-session.ts`, `platform-stats.ts`, `types.ts`, `requireMerchantAdmin`, `session.ts`, `merchant-card-renderer.tsx`, `advantages-ui.tsx`, `ads/[id]/confirm/route.ts`, `super-admin-session.ts`, `cashier-checkout.tsx`, `next`, `consent.ts`, `customer-loyalty-overview.ts`, `use-wallet-unlock-animation.ts`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _1010 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `caisse-scan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12436974789915967 - nodes in this community are weakly interconnected._
- **Should `loyalty-labels.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12692307692307692 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05868544600938967 - nodes in this community are weakly interconnected._