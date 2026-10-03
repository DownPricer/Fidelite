# Graph Report - Cartefidelité  (2026-10-03)

## Corpus Check
- 720 files · ~4,807,163 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 4006 nodes · 12507 edges · 186 communities (155 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `420a02ca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- loyalty-context.ts
- rbac.ts
- merchant-card-template-service.ts
- ouvrir/route.ts
- react
- loyalty-program.ts
- stripe.ts
- google-wallet/route.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-canvas.tsx
- jsonOk
- globalObjectBody
- merchant-billing.ts
- insight-period.ts
- merchants-list.tsx
- prisma.ts
- clients/ui.tsx
- jsonError
- cashier-checkout.tsx
- google-wallet.ts
- google-auth.ts
- middleware.ts
- webhook/route.ts
- requireMutatingRequest
- fiche.tsx
- staff-permissions.ts
- fife-life/merchant-detail.tsx
- create-super-admin.ts
- programme/ui.tsx
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- customer-onboarding.ts
- What You Must Do When Invoked
- scan-session.ts
- media-storage.ts
- loyalty-commit.test.ts
- solde/ui.tsx
- loyalty-commit.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- @prisma/client
- card-editor-properties.tsx
- qa-login.ts
- vitest
- dependencies
- customer-loyalty-overview.ts
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- sponsored-test-broadcast.ts
- card-enlarged-view.tsx
- AdDetailPage
- scripts
- facturation/ui.tsx
- platform-stats.ts
- merchant-demo-server.ts
- types.ts
- ref_fs
- readJson
- stripe-webhook-route.test.ts
- sponsored-placements.test.ts
- demo-visual.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- advantages-ui.tsx
- qr-cache.ts
- unsubscribe-token.ts
- marketing-topup-route.test.ts
- ads/[id]/confirm/route.ts
- rejoindre/[slug]/page.tsx
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- MerchantCampaignFiche
- firstActiveStaffMembership
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- session.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- wallet-home.tsx
- employee-invitation.ts
- src/app/layout.tsx
- [kind]/route.ts
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
- campaigns/[id]/route.ts
- employee-session.ts
- customer-layout-guard.ts
- sponsored-hours-pricing.ts
- card-deck.tsx
- scan/ui.tsx
- cn
- insight-charts.tsx
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- MerchantDetailPage
- next
- cards-index.tsx
- caisse-client-number.test.ts
- sponsored-test-broadcast.test.ts
- push-client.ts
- campaign-moderation-home.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- dashboard/route.ts
- qa-login/page.tsx
- ref_crypto
- lib/campaign-worker.ts
- loyalty-service.test.ts
- google-wallet-doctor.ts
- MerchantCardData
- customer-notifications-route.test.ts
- profile-page.tsx
- CreateMerchantWizard
- parametres/ui.tsx
- sponsored-slot.tsx
- finalisation/page.tsx
- CardEditorBackgroundCrop
- CampagnesPanel
- push.ts
- campaign-audience.test.ts
- ad-detail.tsx
- caisse-scan.test.ts
- qr.ts
- customer-preferences-route.test.ts
- marketing-balance.ts
- sponsored-selection.ts
- statistics/route.ts
- merchant-ad-edit.test.ts
- Card
- super-admin-ad-moderation.test.ts
- card-template-schema.ts
- campaign-quota.test.ts
- EmployeeLoginScreen
- use-media-query.ts
- invitation/page.tsx
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
3. `requireMutatingRequest()` - 163 edges
4. `next` - 161 edges
5. `prisma` - 148 edges
6. `vitest` - 124 edges
7. `clientIp()` - 119 edges
8. `readJson()` - 114 edges
9. `react` - 112 edges
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
- `click()` --calls--> `GET()`  [EXTRACTED]
  tests/sponsored-placements.test.ts → src/app/api/customer/sponsored/route.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (186 total, 31 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.14
Nodes (19): logScanBody(), POST(), scanVia(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber() (+11 more)

### Community 1 - "loyalty-context.ts"
Cohesion: 0.15
Nodes (18): dynamic, MerchantProfilePage(), formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), getActiveMerchantLoyaltyContextBySlug() (+10 more)

### Community 2 - "rbac.ts"
Cohesion: 0.08
Nodes (31): CaissePage(), CustomerDetailPage(), ClientsPage(), DashboardLayout(), heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), hasMerchantStaffAccess() (+23 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (65): GET(), LegacyCardEditorRedirect(), CardEditorVariantRoute(), MerchantCardsGallery(), slotStatusLabel(), slotTone(), statusBadgeClass(), normalizeCardTemplateForSlot() (+57 more)

### Community 4 - "ouvrir/route.ts"
Cohesion: 0.17
Nodes (13): log(), loop(), requestShutdown(), sleep(), GET(), GET(), computeAdLifecycleStatus(), runAdLifecycleTick() (+5 more)

### Community 5 - "react"
Cohesion: 0.11
Nodes (26): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), recoverMessage(), FormState, ChangePasswordPage() (+18 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.07
Nodes (49): assertEarnProgramRules(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), ActiveMerchantLoyaltyContext, progressTargetForBalance(), block() (+41 more)

### Community 7 - "stripe.ts"
Cohesion: 0.09
Nodes (36): stripe, GET(), GET(), BillingCustomerInput, billingParams(), CampaignCheckoutInput, checkoutExpiry(), clientForMode() (+28 more)

### Community 8 - "google-wallet/route.ts"
Cohesion: 0.14
Nodes (23): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+15 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (34): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetView(), pct(), ProgressCircle() (+26 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (51): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), applyEditorAutoFix(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+43 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (35): FILTER_MAP, GET(), DELETE(), deleteSchema, POST(), serializeCampaign(), POST(), CAMPAIGN_STATUS_LABELS (+27 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.10
Nodes (45): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+37 more)

### Community 14 - "jsonOk"
Cohesion: 0.10
Nodes (37): POST(), GET(), GET(), GET(), GET(), PATCH(), GET(), POST() (+29 more)

### Community 15 - "globalObjectBody"
Cohesion: 0.25
Nodes (17): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData() (+9 more)

### Community 16 - "merchant-billing.ts"
Cohesion: 0.10
Nodes (30): GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult, listMerchantInvoices() (+22 more)

### Community 17 - "insight-period.ts"
Cohesion: 0.20
Nodes (23): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+15 more)

### Community 18 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 19 - "prisma.ts"
Cohesion: 0.06
Nodes (61): DELETE(), EDITABLE_STATUSES, GET(), PATCH(), GET(), GET(), POST(), POST() (+53 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "jsonError"
Cohesion: 0.08
Nodes (46): GET(), PATCH(), GET(), POST(), POST(), POST(), POST(), POST() (+38 more)

### Community 22 - "cashier-checkout.tsx"
Cohesion: 0.18
Nodes (17): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+9 more)

### Community 23 - "google-wallet.ts"
Cohesion: 0.14
Nodes (36): isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue() (+28 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.14
Nodes (24): GET(), GET(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie(), encodeStateCookie(), GOOGLE_SCOPES, GoogleAuthIntent (+16 more)

### Community 25 - "middleware.ts"
Cohesion: 0.14
Nodes (24): isProduction(), hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost() (+16 more)

### Community 26 - "webhook/route.ts"
Cohesion: 0.09
Nodes (29): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), isCancellable() (+21 more)

### Community 27 - "requireMutatingRequest"
Cohesion: 0.10
Nodes (66): POST(), POST(), schema, POST(), POST(), POST(), GET(), POST() (+58 more)

### Community 28 - "fiche.tsx"
Cohesion: 0.12
Nodes (19): AdStatus, Detail, euros(), HistoryRow, PaymentPreview, PayMethod, STATUS_LABELS, block (+11 more)

### Community 29 - "staff-permissions.ts"
Cohesion: 0.18
Nodes (11): GET(), requireEmployee(), ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS, EMPLOYEE_FIXED_PERMISSIONS, MANAGER_DEFAULT, PERMISSION_KEYS (+3 more)

### Community 30 - "fife-life/merchant-detail.tsx"
Cohesion: 0.10
Nodes (26): CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel() (+18 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "programme/ui.tsx"
Cohesion: 0.16
Nodes (14): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+6 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.11
Nodes (28): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+20 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.11
Nodes (21): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+13 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.10
Nodes (34): GET(), GET(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES, AD_VISUAL_MAX_PX, AD_VISUAL_MIN_PX, AD_VISUAL_RATIO (+26 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.16
Nodes (20): invalidateCustomerAccessTokens(), beginCustomerOnboarding(), buildAccountRecoveryUrl(), buildEmailVerificationUrl(), CustomerAccessLevel, CustomerOnboardingUser, FINALIZATION_PATH_PREFIXES, FINALIZATION_REMINDER_MS (+12 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan-session.ts"
Cohesion: 0.23
Nodes (19): CaisseScreen(), formatCameraError(), QrScanner(), onDecode(), CAISSE_SCAN_PATH, CAMERA_START_TIMEOUT_MS, finalizeCameraStart(), formatRetryAfter() (+11 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.11
Nodes (29): GET(), MIME, GET(), MIME, appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot() (+21 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "solde/ui.tsx"
Cohesion: 0.16
Nodes (15): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, estimateSponsorPricing() (+7 more)

### Community 44 - "loyalty-commit.ts"
Cohesion: 0.08
Nodes (48): GET(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction() (+40 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.18
Nodes (17): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), DemoRole (+9 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.06
Nodes (43): next-themes, BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS (+35 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (20): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+12 more)

### Community 49 - "@prisma/client"
Cohesion: 0.08
Nodes (38): @prisma/client, GET(), sortOrder(), GET(), loadProgram(), balanceFieldForUnit(), incrementBalanceData(), legacyPointsForUnitBalance() (+30 more)

### Community 50 - "card-editor-properties.tsx"
Cohesion: 0.15
Nodes (18): REQUIRED_BY_SLOT, TEXT_TYPES, BACKGROUND_FIT_LABELS, containsForbiddenTechnicalLabel(), DATA_KEY_LABELS, dataKeyLabel(), FIT_MODE_LABELS, FONT_FAMILY_LABELS (+10 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.13
Nodes (25): assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), auditQaLogin(), configuredSubjectId(), createQaMagicLoginToken(), CreateQaMagicLoginTokenOptions (+17 more)

### Community 52 - "vitest"
Cohesion: 0.03
Nodes (52): ref_node_fs, ref_node_path, ref_node_url, playwright, vitest, outDir, pages, OUT (+44 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "customer-loyalty-overview.ts"
Cohesion: 0.11
Nodes (38): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, buildScanResult() (+30 more)

### Community 55 - "email.ts"
Cohesion: 0.17
Nodes (26): nodemailer, ContactPage(), buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput, emailConfigHint() (+18 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.11
Nodes (27): percentChange(), buildCohorts(), buildFinancial(), buildOverview(), buildRetention(), buildRewards(), buildSegments(), buildTeam() (+19 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.11
Nodes (10): MobilePlacementPreview(), resetSponsoredSessionState(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer (+2 more)

### Community 59 - "sponsored-test-broadcast.ts"
Cohesion: 0.17
Nodes (24): buildGlobalWalletValueAddedModule(), globalWalletCampaignDetailUri(), GlobalWalletCampaignModule, localized(), resolveGlobalWalletCampaignHeroUrl(), walletHttpsUri(), publicGoogleWalletError(), syncAllGoogleWalletGlobalObjects() (+16 more)

### Community 60 - "card-enlarged-view.tsx"
Cohesion: 0.11
Nodes (21): motion, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), DiscoverPage(), Merchant (+13 more)

### Community 61 - "AdDetailPage"
Cohesion: 0.22
Nodes (14): AdDetailPage(), confirmReason(), patch(), requestSend(), run(), sendProposal(), startTestBroadcast(), stopTestBroadcast() (+6 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.23
Nodes (15): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+7 more)

### Community 65 - "merchant-demo-server.ts"
Cohesion: 0.14
Nodes (13): CaisseAliasPage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE, isMerchantDemoCookieValue() (+5 more)

### Community 66 - "types.ts"
Cohesion: 0.10
Nodes (28): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, LADDER, resolveTier() (+20 more)

### Community 67 - "ref_fs"
Cohesion: 0.06
Nodes (23): ref_fs, ref_path, main(), outDir, shot(), outDir, main(), outDir (+15 more)

### Community 68 - "readJson"
Cohesion: 0.07
Nodes (46): zod, POST(), schema, GET(), markReadSchema, PATCH(), GET(), PATCH() (+38 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "sponsored-placements.test.ts"
Cohesion: 0.08
Nodes (26): END, fake, h, previewCall(), START, END, fake, START (+18 more)

### Community 71 - "demo-visual.ts"
Cohesion: 0.12
Nodes (25): CarteIdentitePage(), AccountPage(), ParametresPage(), dynamic, NotificationsPage(), PREVIEW_BENEFITS, PREVIEW_HISTORY, PREVIEW_PREFERENCES (+17 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.12
Nodes (33): LoyaltyWidgetProgressInput, COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps (+25 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "advantages-ui.tsx"
Cohesion: 0.16
Nodes (15): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+7 more)

### Community 75 - "qr-cache.ts"
Cohesion: 0.14
Nodes (20): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce (+12 more)

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.23
Nodes (9): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError, verifyUnsubscribeToken(), consentEventCreateMany (+1 more)

### Community 77 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 78 - "ads/[id]/confirm/route.ts"
Cohesion: 0.12
Nodes (33): billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, GET() (+25 more)

### Community 79 - "rejoindre/[slug]/page.tsx"
Cohesion: 0.16
Nodes (12): AppLoginPage(), CustomerLoginPage(), CustomerSignupPage(), CustomerSignupForm(), JoinMerchantPage(), isGoogleAuthConfigured(), isGoogleSignInEnabled(), formatEurosFromCents() (+4 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.07
Nodes (34): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), Check, DiagnosticPage() (+26 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "MerchantCampaignFiche"
Cohesion: 0.35
Nodes (10): api(), MerchantCampaignFiche(), addSources(), onFile(), onFramed(), post(), onFileChosen(), isExactBanner() (+2 more)

### Community 85 - "firstActiveStaffMembership"
Cohesion: 0.14
Nodes (27): CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), FidelisationPanel(), FacturationPage() (+19 more)

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.14
Nodes (15): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, h, jsonRequest() (+7 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "session.ts"
Cohesion: 0.24
Nodes (12): GET(), createRawCustomerToken(), CUSTOMER_TOKEN_TTL, issueCustomerAccessToken(), resetBrowserAuthState(), cookieOptions(), createSession(), destroySession() (+4 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (23): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+15 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "wallet-home.tsx"
Cohesion: 0.11
Nodes (17): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), WalletHome(), WalletQrAction(), ActiveWalletCard, buildFifeLifeNextReward(), CustomerLoyaltyOverview (+9 more)

### Community 102 - "employee-invitation.ts"
Cohesion: 0.29
Nodes (9): buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired(), createMembershipInvitation() (+1 more)

### Community 103 - "src/app/layout.tsx"
Cohesion: 0.15
Nodes (8): src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR, ThemeProvider()

### Community 104 - "[kind]/route.ts"
Cohesion: 0.24
Nodes (5): ref_os, GET(), notFound(), loadRoute(), PNG_BYTES

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
Cohesion: 0.11
Nodes (15): recharts, DashboardLayout(), SuperAdminStatsPage(), StatisticsPage(), AppNav(), icons, isActive(), TOOLS_PREFIXES (+7 more)

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
Nodes (12): dynamic, robots(), dynamic, sitemap(), assertSameOrigin(), CsrfError, employeeCookieName(), employeeTokenFromRequest() (+4 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "use-wallet-unlock-animation.ts"
Cohesion: 0.16
Nodes (21): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), isDocumentVisible() (+13 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "campaigns/[id]/route.ts"
Cohesion: 0.31
Nodes (8): DELETE(), GET(), loadOwnedCampaign(), PATCH(), POST(), schema, refundCampaignDebit(), campaignContentSchema

### Community 125 - "employee-session.ts"
Cohesion: 0.10
Nodes (24): EmployeeLoginPage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS, cookieOptions() (+16 more)

### Community 126 - "customer-layout-guard.ts"
Cohesion: 0.33
Nodes (7): CarteLayout(), CompteLayout(), NotificationsLayout(), enforceCustomerWalletAccess(), customerWalletGuardRedirect(), isFinalizationAllowedPath(), runCustomerOnboardingSideEffects()

### Community 127 - "sponsored-hours-pricing.ts"
Cohesion: 0.14
Nodes (22): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotsToHours() (+14 more)

### Community 128 - "card-deck.tsx"
Cohesion: 0.20
Nodes (12): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+4 more)

### Community 129 - "scan/ui.tsx"
Cohesion: 0.12
Nodes (19): ADMIN_PERMISSIONS, ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel(), CashierScanResult (+11 more)

### Community 130 - "cn"
Cohesion: 0.10
Nodes (22): DEMO, Employee, EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend() (+14 more)

### Community 131 - "insight-charts.tsx"
Cohesion: 0.11
Nodes (17): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric, InsightBarChart(), InsightCard() (+9 more)

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.09
Nodes (35): GET(), POST(), GET(), POST(), POST(), POST(), GET(), mapEmployee() (+27 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 135 - "next"
Cohesion: 0.07
Nodes (14): nextConfig, next, dynamic, metadata, viewport, EmployeeHomePage(), EmployeeScanPage(), metadata (+6 more)

### Community 136 - "cards-index.tsx"
Cohesion: 0.31
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 137 - "caisse-client-number.test.ts"
Cohesion: 0.26
Nodes (10): deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber(), normalizeCustomerNumber(), resolveClientNumber(), scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique (+2 more)

### Community 138 - "sponsored-test-broadcast.test.ts"
Cohesion: 0.22
Nodes (8): adFindUnique, adRow, broadcastDelete, broadcastFindUnique, broadcastUpdate, broadcastUpsert, syncAll, walletCount

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.21
Nodes (16): ad(), approvedAd(), asAdmin(), asCustomer(), asMerchant(), ctx(), customerCard(), dataUrl() (+8 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.14
Nodes (12): ref_sharp, files, INPUT_DIR, adminStage(), createAd(), ctx(), fake, h (+4 more)

### Community 143 - "dashboard/route.ts"
Cohesion: 0.50
Nodes (6): GET(), resolvePeriod(), getFreeMerchantStats(), getHomeStats(), getTotalClients(), hasAnyRecordedRevenue()

### Community 144 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 145 - "ref_crypto"
Cohesion: 0.47
Nodes (5): ref_crypto, installQaMocks(), loadQaLogin(), sha256(), state

### Community 146 - "lib/campaign-worker.ts"
Cohesion: 0.11
Nodes (27): networkAudienceWhere(), backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick() (+19 more)

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 148 - "google-wallet-doctor.ts"
Cohesion: 0.39
Nodes (8): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl(), publicUrl()

### Community 149 - "MerchantCardData"
Cohesion: 0.13
Nodes (8): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList(), ScanResultCardPayload

### Community 150 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 151 - "profile-page.tsx"
Cohesion: 0.08
Nodes (36): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+28 more)

### Community 152 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.22
Nodes (13): IMAGE_CLASS, SponsoredAd, SponsoredBanner(), SponsoredVariant, getDismissedAds(), rememberDismissed(), reportedThisSession, SponsoredPlacement (+5 more)

### Community 155 - "finalisation/page.tsx"
Cohesion: 0.26
Nodes (7): FinalisationPage(), FinalisationForm(), resolveCustomerAccessLevel(), isSmsConfigured(), sendSms(), smsConfigHint(), SmsSendResult

### Community 157 - "CampagnesPanel"
Cohesion: 0.22
Nodes (4): audienceDisplay(), CampagnesPanel(), CampaignWizard(), statusTone()

### Community 158 - "push.ts"
Cohesion: 0.31
Nodes (7): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), WebPushNotConfiguredError

### Community 160 - "ad-detail.tsx"
Cohesion: 0.11
Nodes (18): AdRequestDetail, AdStatus, AUDIT_LABELS, AuditRow, Delivery, Draft, Journey, PLACEMENT_LABELS (+10 more)

### Community 161 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 162 - "qr.ts"
Cohesion: 0.17
Nodes (17): main(), prisma, requiredEnv(), upsertEmployee(), qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+9 more)

### Community 164 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 165 - "marketing-balance.ts"
Cohesion: 0.17
Nodes (12): debitForCampaign(), MAX_TOPUP_CENTS, MIN_TOPUP_CENTS, TOPUP_PRESETS_CENTS, StripeModeValue, Entry, makeTx(), Mode (+4 more)

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.14
Nodes (24): main(), AdCandidate, CustomerZone, DeliveryCheck, diagnoseAdDelivery(), evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS (+16 more)

### Community 167 - "statistics/route.ts"
Cohesion: 0.15
Nodes (12): GET(), PERIOD_KEYS, InsightPeriodKey, getLockedInsightPlaceholder(), findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium (+4 more)

### Community 168 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 169 - "Card"
Cohesion: 0.10
Nodes (11): metadata, ContactForm(), SPACES, ACTIVITY_LABELS, DashboardHome(), formatEuros(), Overview, QUICK_LINKS (+3 more)

### Community 170 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 173 - "card-template-schema.ts"
Cohesion: 0.09
Nodes (30): CardTemplateBackground(), BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr() (+22 more)

### Community 175 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 176 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

## Knowledge Gaps
- **1009 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+1004 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1361 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `caisse-scan.ts`, `scan/ui.tsx`, `rbac.ts`, `insight-charts.tsx`, `ouvrir/route.ts`, `react`, `loyalty-context.ts`, `merchant-card-template-service.ts`, `cards-index.tsx`, `super-admin-campaign-moderation.test.ts`, `campaign-moderation-home.tsx`, `qa-login/page.tsx`, `merchants-list.tsx`, `clients/ui.tsx`, `jsonError`, `MerchantCardData`, `profile-page.tsx`, `google-auth.ts`, `middleware.ts`, `customer-notifications-route.test.ts`, `requireMutatingRequest`, `finalisation/page.tsx`, `fife-life/merchant-detail.tsx`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `customer-preferences-route.test.ts`, `ad-visuals.ts`, `statistics/route.ts`, `merchant-ad-edit.test.ts`, `media-storage.ts`, `Card`, `super-admin-ad-moderation.test.ts`, `demo-session.ts`, `src/app/page.tsx`, `vitest`, `customer-loyalty-overview.ts`, `card-enlarged-view.tsx`, `merchant-demo-server.ts`, `types.ts`, `ref_fs`, `demo-visual.ts`, `advantages-ui.tsx`, `unsubscribe-token.ts`, `marketing-topup-route.test.ts`, `rejoindre/[slug]/page.tsx`, `super-admin-session.ts`, `firstActiveStaffMembership`, `session.ts`, `campagnes/ui.tsx`, `wallet-home.tsx`, `src/app/layout.tsx`, `layout-shell.tsx`, `notifications-center.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `employee-session.ts`, `customer-layout-guard.ts`?**
  _High betweenness centrality (0.216) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `loyalty-context.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `ouvrir/route.ts`, `react`, `loyalty-program.ts`, `stripe.ts`, `google-wallet/route.ts`, `loyalty-widget-view.tsx`, `loyalty-widget.ts`, `card-editor-canvas.tsx`, `merchant-billing.ts`, `insight-period.ts`, `google-auth.ts`, `middleware.ts`, `webhook/route.ts`, `fife-life/merchant-detail.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `customer-onboarding.ts`, `scan-session.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `loyalty-commit.ts`, `@prisma/client`, `customer-loyalty-overview.ts`, `email.ts`, `sponsored-slot.test.tsx`, `sponsored-test-broadcast.ts`, `card-enlarged-view.tsx`, `platform-stats.ts`, `merchant-demo-server.ts`, `ref_fs`, `stripe-webhook-route.test.ts`, `sponsored-placements.test.ts`, `merchant-card-renderer.tsx`, `unsubscribe-token.ts`, `marketing-topup-route.test.ts`, `ads/[id]/confirm/route.ts`, `rejoindre/[slug]/page.tsx`, `super-admin-session.ts`, `ad-visual-journeys.test.ts`, `employee-invitation.ts`, `src/app/layout.tsx`, `[kind]/route.ts`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `use-wallet-unlock-animation.ts`, `campaign-confirm-route.test.ts`, `employee-session.ts`, `card-deck.tsx`, `scan/ui.tsx`, `employees/[id]/route.ts`, `super-admin-campaign-moderation.test.ts`, `next`, `caisse-client-number.test.ts`, `sponsored-test-broadcast.test.ts`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `dashboard/route.ts`, `ref_crypto`, `lib/campaign-worker.ts`, `loyalty-service.test.ts`, `customer-notifications-route.test.ts`, `campaign-audience.test.ts`, `caisse-scan.test.ts`, `qr.ts`, `customer-preferences-route.test.ts`, `marketing-balance.ts`, `statistics/route.ts`, `merchant-ad-edit.test.ts`, `super-admin-ad-moderation.test.ts`, `card-template-schema.ts`, `campaign-quota.test.ts`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `loyalty-context.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `ouvrir/route.ts`, `employees/[id]/route.ts`, `loyalty-program.ts`, `cards-index.tsx`, `loyalty-widget.ts`, `card-editor-canvas.tsx`, `jsonOk`, `merchant-billing.ts`, `lib/campaign-worker.ts`, `prisma.ts`, `loyalty-service.test.ts`, `jsonError`, `cashier-checkout.tsx`, `profile-page.tsx`, `google-auth.ts`, `google-wallet.ts`, `webhook/route.ts`, `requireMutatingRequest`, `MerchantCardData`, `staff-permissions.ts`, `fife-life/merchant-detail.tsx`, `create-super-admin.ts`, `programme/ui.tsx`, `card-editor.tsx`, `qr.ts`, `package.json`, `marketing-balance.ts`, `customer-onboarding.ts`, `sponsored-selection.ts`, `loyalty-commit.ts`, `card-template-schema.ts`, `card-editor-properties.tsx`, `qa-login.ts`, `vitest`, `customer-loyalty-overview.ts`, `insight-stats.ts`, `sponsored-test-broadcast.ts`, `platform-stats.ts`, `types.ts`, `readJson`, `merchant-card-renderer.tsx`, `advantages-ui.tsx`, `ads/[id]/confirm/route.ts`, `super-admin-session.ts`, `session.ts`, `wallet-home.tsx`, `use-wallet-unlock-animation.ts`, `employee-session.ts`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _1009 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `caisse-scan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13675213675213677 - nodes in this community are weakly interconnected._
- **Should `rbac.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07801418439716312 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05727605727605728 - nodes in this community are weakly interconnected._