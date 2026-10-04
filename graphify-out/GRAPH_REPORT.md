# Graph Report - Cartefidelité  (2026-10-04)

## Corpus Check
- 740 files · ~4,841,017 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 4098 nodes · 12898 edges · 193 communities (162 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ad3c6b4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- loyalty-context.ts
- firstActiveStaffMembership
- merchant-card-template-service.ts
- ouvrir/route.ts
- react
- loyalty-program.ts
- merchant-billing.ts
- google-wallet/route.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-canvas.tsx
- api-guard.ts
- customer-reward-progress.ts
- http.ts
- isGoogleWalletConfigured
- [id]/merchant-detail.tsx
- prisma
- clients/ui.tsx
- jsonError
- super-admin.test.ts
- google-wallet.ts
- google-auth.ts
- hosts.ts
- jsonOk
- layout-shell.tsx
- ad-visual-parts.tsx
- sponsored-placements.test.ts
- loyaltyBalanceForMode
- prisma.ts
- programme/ui.tsx
- card-editor.tsx
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- customer-onboarding.ts
- What You Must Do When Invoked
- stripe-webhook-marketing.test.ts
- media-storage.ts
- loyalty-commit.test.ts
- card-editor-properties.tsx
- loyalty-service.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- card-editor-polish.test.ts
- loyalty-program-publication.ts
- fife-life/merchant-detail.tsx
- qa-login.ts
- ref_node_path
- dependencies
- stripe.ts
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- sponsored-test-broadcast.ts
- wallet-home.tsx
- app/statistiques/page.tsx
- scripts
- facturation/ui.tsx
- platform-stats.ts
- demo-visual.ts
- card-deck.tsx
- ref_fs
- WalletHome
- stripe-webhook-route.test.ts
- fake-ad-db.ts
- ad-detail-wallet-panel.tsx
- merchant-card-renderer.tsx
- AdvantagesEditor
- cn
- qr-cache.ts
- unsubscribe-token.ts
- loyalty-commit.ts
- requireMerchantAdmin
- app/app/connexion/page.tsx
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- interactive-loyalty-card.tsx
- rbac.ts
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
- money.ts
- AdDetailPage
- profile-page.tsx
- [kind]/route.ts
- apply-ad-visual-crop.ts
- graphify reference: query, path, explain
- campaign-worker.test.ts
- merchant-ui.tsx
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- tarifs/page.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- env.ts
- ad-confirm-route.test.ts
- wallet-unlock.ts
- campaign-confirm-route.test.ts
- qr.ts
- employee-session.ts
- cashier-checkout.tsx
- sponsored-hours-pricing.ts
- caisse-client-number.test.ts
- scan/ui.tsx
- EmployeeDetailPanel
- app/ui.tsx
- employee-invitation-service.ts
- marketing-topup-route.test.ts
- staff-notification-delivery.ts
- next
- cards-index.tsx
- landing-page.test.ts
- webhook/route.ts
- push-client.ts
- campaign-moderation-home.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- staff-permissions.ts
- generate-pwa-icons.mjs
- stripe-mode.test.ts
- lib/campaign-worker.ts
- @prisma/client
- caisse-scan-route.test.ts
- merchant-billing.test.ts
- scripts/campaign-worker.ts
- customer-loyalty-overview.ts
- GET
- google-wallet-doctor.ts
- sponsored-slot.tsx
- send/route.ts
- merchant-ad-edit.test.ts
- landing-hero-visual.tsx
- statistiques-scroll.test.ts
- campaign-audience.test.ts
- ad-detail.tsx
- invitation/page.tsx
- caisse-scan.test.ts
- campaign-lifecycle.ts
- vitest
- marketing-balance.test.ts
- sponsored-selection.ts
- api-merchant-statistics-route.test.ts
- ad-google-wallet-visual-workflow.ts
- landing-faq.tsx
- super-admin-ad-moderation.test.ts
- create-super-admin.ts
- card-template-schema.ts
- theme-toggle.tsx
- landing-footer.tsx
- resolveMediaFilePath
- landing-header.tsx
- EmployeeLoginScreen
- use-media-query.ts
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
- capture-employe-screenshots.mjs
- SettingsPanel

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 269 edges
2. `jsonOk()` - 235 edges
3. `requireMutatingRequest()` - 171 edges
4. `next` - 161 edges
5. `prisma` - 152 edges
6. `vitest` - 128 edges
7. `clientIp()` - 123 edges
8. `readJson()` - 122 edges
9. `react` - 116 edges
10. `userAgent()` - 112 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveStripeMode()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `isPaymentAllowedForMerchant()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (193 total, 31 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.19
Nodes (17): logScanBody(), POST(), scanVia(), buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan() (+9 more)

### Community 1 - "loyalty-context.ts"
Cohesion: 0.12
Nodes (35): formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot (+27 more)

### Community 2 - "firstActiveStaffMembership"
Cohesion: 0.22
Nodes (20): CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), FacturationPage() (+12 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.05
Nodes (63): CardEditorVariantRoute(), defaultCardTemplateConfig(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, isLoyaltyProgramSlot(), loyaltyModeForCardSlot(), merchantCardsGalleryPath() (+55 more)

### Community 4 - "ouvrir/route.ts"
Cohesion: 0.20
Nodes (9): GET(), GET(), computeAdLifecycleStatus(), isSafeAdUrl(), AdForWorkflow, isWithinUtcIntervals(), UtcInterval, adEventCreate (+1 more)

### Community 5 - "react"
Cohesion: 0.08
Nodes (31): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), recoverMessage(), metadata, ContactForm() (+23 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.10
Nodes (34): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, EarnHistory, evaluateEarn(), formatDurationMinutes(), LoyaltyAction (+26 more)

### Community 7 - "merchant-billing.ts"
Cohesion: 0.14
Nodes (23): GET(), GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult (+15 more)

### Community 8 - "google-wallet/route.ts"
Cohesion: 0.15
Nodes (23): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+15 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.07
Nodes (36): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyGaugeThumbnail(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView() (+28 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.09
Nodes (41): LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, missingWidgetLabel(), publishValidationResult(), summarizeEditorValidation(), PublishValidationResult (+33 more)

### Community 11 - "validation.ts"
Cohesion: 0.04
Nodes (56): zod, schema, GET(), POST(), GET(), POST(), deleteSchema, GET() (+48 more)

### Community 12 - "VisualPicker"
Cohesion: 0.31
Nodes (11): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onFidetoFilesSelected(), onSelfFileSelected() (+3 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.12
Nodes (39): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+31 more)

### Community 14 - "api-guard.ts"
Cohesion: 0.10
Nodes (26): GET(), PERIOD_KEYS, GET(), GET(), GET(), GET(), GET(), GET() (+18 more)

### Community 15 - "customer-reward-progress.ts"
Cohesion: 0.15
Nodes (21): TargetBlock(), buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState (+13 more)

### Community 16 - "http.ts"
Cohesion: 0.11
Nodes (32): POST(), schema, POST(), schema, POST(), POST(), POST(), dynamic (+24 more)

### Community 17 - "isGoogleWalletConfigured"
Cohesion: 0.12
Nodes (35): POST(), POST(), isGoogleWalletConfigured(), accessToken(), assertConfigured(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl() (+27 more)

### Community 18 - "[id]/merchant-detail.tsx"
Cohesion: 0.08
Nodes (24): MEDIA_TO_APPEARANCE_KEY, MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), RECOMMENDED_WALLET_COLORS, revokeWalletPreviews() (+16 more)

### Community 19 - "prisma"
Cohesion: 0.07
Nodes (49): EDITABLE_STATUSES, GET(), PATCH(), GET(), GET(), POST(), POST(), LOYALTY_MODES (+41 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "jsonError"
Cohesion: 0.06
Nodes (55): GET(), PATCH(), GET(), POST(), GET(), DELETE(), FILTER_MAP, GET() (+47 more)

### Community 22 - "super-admin.test.ts"
Cohesion: 0.27
Nodes (12): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+4 more)

### Community 23 - "google-wallet.ts"
Cohesion: 0.21
Nodes (23): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), GoogleWalletImage (+15 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.11
Nodes (29): GET(), GET(), CustomerLoginPage(), CustomerSignupPage(), CustomerSignupForm(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl() (+21 more)

### Community 25 - "hosts.ts"
Cohesion: 0.11
Nodes (28): appOriginForPublicLinks(), canonicalOrigin(), FORBIDDEN_PUBLIC_HOSTS, hostMatches(), hostnameForbidden(), hostnameOf(), isAdminHost(), isAppHost() (+20 more)

### Community 26 - "jsonOk"
Cohesion: 0.09
Nodes (84): POST(), POST(), POST(), POST(), POST(), POST(), POST(), GET() (+76 more)

### Community 27 - "layout-shell.tsx"
Cohesion: 0.10
Nodes (18): recharts, SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), ACTIVITY_LABELS, DashboardHome(), formatEuros() (+10 more)

### Community 28 - "ad-visual-parts.tsx"
Cohesion: 0.11
Nodes (26): AdStatus, api(), Detail, euros(), HistoryRow, MerchantCampaignFiche(), addSources(), onFile() (+18 more)

### Community 29 - "sponsored-placements.test.ts"
Cohesion: 0.16
Nodes (16): GET(), previewResponse(), withResolvedImage(), resolveSponsoredImageUrl(), loadAdPreviewCard(), parsePlacement(), selectSponsoredForCustomer(), click() (+8 more)

### Community 30 - "loyaltyBalanceForMode"
Cohesion: 0.24
Nodes (18): main(), GET(), dynamic, GET(), GET(), CarteIndexPage(), dynamic, CardPage() (+10 more)

### Community 31 - "prisma.ts"
Cohesion: 0.13
Nodes (26): POST(), GET(), POST(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET() (+18 more)

### Community 32 - "programme/ui.tsx"
Cohesion: 0.17
Nodes (13): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+5 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.11
Nodes (31): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+23 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.15
Nodes (19): CoverCropEditor(), onPointerMove(), patchState(), CoverCropEditorSpec, GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState() (+11 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.11
Nodes (31): GET(), GET(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES, AD_VISUAL_MAX_PX, AD_VISUAL_MIN_PX, AD_VISUAL_RATIO (+23 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.12
Nodes (26): CarteLayout(), CompteLayout(), NotificationsLayout(), enforceCustomerWalletAccess(), beginCustomerOnboarding(), buildAccountRecoveryUrl(), buildEmailVerificationUrl(), CustomerAccessLevel (+18 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.14
Nodes (25): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCampaignMedia(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig (+17 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "card-editor-properties.tsx"
Cohesion: 0.13
Nodes (22): CardEditorProperties(), patchRect(), REQUIRED_BY_SLOT, TEXT_TYPES, qrOverlapsOthers(), BACKGROUND_FIT_LABELS, DATA_KEY_LABELS, dataKeyLabel() (+14 more)

### Community 44 - "loyalty-service.ts"
Cohesion: 0.14
Nodes (22): GET(), sortOrder(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), balanceFieldForUnit(), incrementBalanceData(), legacyPointsForUnitBalance() (+14 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.15
Nodes (16): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), applyDemoRoleCookies() (+8 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.11
Nodes (23): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+15 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "card-editor-polish.test.ts"
Cohesion: 0.24
Nodes (15): containsForbiddenTechnicalLabel(), ELEMENT_TYPE_LABELS, qrVisuallySquareInPixels(), canUseSessionStorage(), hasAnimatedCard(), hasSeenWalletEvent(), markCardAnimated(), markWalletEventSeen() (+7 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.15
Nodes (20): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+12 more)

### Community 50 - "fife-life/merchant-detail.tsx"
Cohesion: 0.07
Nodes (30): AddToGoogleWalletButton(), LinearGauge(), MerchantCardPublicPreview(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail() (+22 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (41): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), GET(), POST(), QaExchangeBody, qaJson() (+33 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (36): ref_node_fs, ref_node_path, ref_node_url, playwright, outDir, pages, OUT, OUT (+28 more)

### Community 53 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+12 more)

### Community 54 - "stripe.ts"
Cohesion: 0.14
Nodes (22): BillingCustomerInput, billingParams(), CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, createBillingPortalSession(), createCampaignCheckoutSession() (+14 more)

### Community 55 - "email.ts"
Cohesion: 0.18
Nodes (26): nodemailer, ContactPage(), requestAccountRecovery(), buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput (+18 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.08
Nodes (56): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+48 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.12
Nodes (9): resetSponsoredSessionState(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer, observers (+1 more)

### Community 59 - "sponsored-test-broadcast.ts"
Cohesion: 0.11
Nodes (33): DELETE(), GET(), buildGlobalWalletValueAddedModule(), globalWalletCampaignDetailUri(), GlobalWalletCampaignModule, localized(), resolveGlobalWalletCampaignHeroUrl(), walletHttpsUri() (+25 more)

### Community 60 - "wallet-home.tsx"
Cohesion: 0.10
Nodes (24): motion, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), ExpandableQrCode(), handleActivate() (+16 more)

### Community 61 - "app/statistiques/page.tsx"
Cohesion: 0.20
Nodes (8): heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), canViewStatistics(), admin, cashier, grantedCashier, manager

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.23
Nodes (15): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+7 more)

### Community 65 - "demo-visual.ts"
Cohesion: 0.09
Nodes (28): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), PREVIEW_PREFERENCES, PREVIEW_PROFILE, CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode() (+20 more)

### Community 66 - "card-deck.tsx"
Cohesion: 0.18
Nodes (14): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+6 more)

### Community 67 - "ref_fs"
Cohesion: 0.08
Nodes (17): ref_fs, ref_path, main(), outDir, shot(), outDir, OUT, shots (+9 more)

### Community 68 - "WalletHome"
Cohesion: 0.16
Nodes (15): GET(), GET(), WalletHome(), buildFifeLifeNextReward(), resolveNextRewardForActiveCard(), logMerchantCardSwitch(), MerchantCardSwitchContext, MerchantCardSwitchStep (+7 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "fake-ad-db.ts"
Cohesion: 0.13
Nodes (18): END, fake, h, previewCall(), START, END, fake, START (+10 more)

### Community 71 - "ad-detail-wallet-panel.tsx"
Cohesion: 0.17
Nodes (16): onFileChosen(), AdDetailWalletPanel(), confirmCrop(), onFileChosen(), sendWalletProposal(), formatDateTime(), post(), Props (+8 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.15
Nodes (29): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc() (+21 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "cn"
Cohesion: 0.10
Nodes (23): DashboardLayout(), DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog() (+15 more)

### Community 75 - "qr-cache.ts"
Cohesion: 0.12
Nodes (21): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_HISTORY, PREVIEW_QR, QrBlock(), cache, cacheKey() (+13 more)

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.22
Nodes (10): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken() (+2 more)

### Community 77 - "loyalty-commit.ts"
Cohesion: 0.21
Nodes (17): appliedTierLabel(), assembleView(), buildView(), CAISSE_GRANT_TTL_MS, commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive() (+9 more)

### Community 78 - "requireMerchantAdmin"
Cohesion: 0.10
Nodes (50): billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, POST() (+42 more)

### Community 79 - "app/app/connexion/page.tsx"
Cohesion: 0.39
Nodes (6): AppLoginPage(), formatEurosFromCents(), isMerchantPlanId(), MERCHANT_PLANS, MerchantPlan, MerchantPlanId

### Community 80 - "super-admin-session.ts"
Cohesion: 0.08
Nodes (29): AuditPage(), SuperAdminAuditPage(), Check, DiagnosticPage(), Item, SuperAdminDiagnosticPage(), SuperAdminAdDetailPage(), SuperAdminCampagnesPage() (+21 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "interactive-loyalty-card.tsx"
Cohesion: 0.10
Nodes (27): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, LADDER, resolveTier() (+19 more)

### Community 85 - "rbac.ts"
Cohesion: 0.14
Nodes (20): CaissePage(), CustomerDetailPage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace() (+12 more)

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
Cohesion: 0.13
Nodes (24): GET(), dynamic, MerchantProfilePage(), CarteIdentitePage(), AccountPage(), ParametresPage(), dynamic, NotificationsPage() (+16 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.04
Nodes (43): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), AD_STATUS_LABELS, AdRequest, AdStatus (+35 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "money.ts"
Cohesion: 0.15
Nodes (20): AmountField(), press(), KEYS, RewardConfig, evaluateReward(), parseRewardConditions(), RewardConditions, rewardIsStackable() (+12 more)

### Community 102 - "AdDetailPage"
Cohesion: 0.22
Nodes (14): AdDetailPage(), confirmBannerCrop(), confirmReason(), patch(), requestSend(), run(), sendProposal(), startTestBroadcast() (+6 more)

### Community 103 - "profile-page.tsx"
Cohesion: 0.05
Nodes (45): next-themes, src_app_globals, dynamic, manrope, metadata, viewport, AvatarFileInput(), AvatarPreviewEditor() (+37 more)

### Community 104 - "[kind]/route.ts"
Cohesion: 0.24
Nodes (5): ref_os, GET(), notFound(), loadRoute(), PNG_BYTES

### Community 105 - "apply-ad-visual-crop.ts"
Cohesion: 0.29
Nodes (10): sharp, renderAdVisualCrop(), AD_BANNER_CROP_SPEC, AD_VISUAL_CROP_SPECS, AdVisualCropSpec, AdVisualCropTarget, parseCropState(), coverCropExtractRegion() (+2 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "merchant-ui.tsx"
Cohesion: 0.12
Nodes (18): DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), FidelisationPanel(), icons (+10 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "tarifs/page.tsx"
Cohesion: 0.18
Nodes (9): HomePage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS, resolveLandingAuthTargets() (+1 more)

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "env.ts"
Cohesion: 0.11
Nodes (11): dynamic, robots(), dynamic, sitemap(), assertSameOrigin(), CsrfError, env, getAllowedOrigins() (+3 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "wallet-unlock.ts"
Cohesion: 0.27
Nodes (11): isDocumentVisible(), useWalletUnlockAnimation(), flushWhenVisible(), cardFromUnlockEvent(), canEnqueueUnlockEvent(), shouldDeferUnlockPlayback(), isUnlockEventType(), serializeWalletEvent() (+3 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "qr.ts"
Cohesion: 0.17
Nodes (17): main(), prisma, requiredEnv(), upsertEmployee(), qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+9 more)

### Community 125 - "employee-session.ts"
Cohesion: 0.19
Nodes (17): EmployeeLoginPage(), ProEntryPage(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason() (+9 more)

### Community 126 - "cashier-checkout.tsx"
Cohesion: 0.23
Nodes (13): CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase, RewardCard(), statusClass(), commitCaisseTransaction() (+5 more)

### Community 127 - "sponsored-hours-pricing.ts"
Cohesion: 0.12
Nodes (26): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotAmountCents() (+18 more)

### Community 128 - "caisse-client-number.test.ts"
Cohesion: 0.23
Nodes (9): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken(), fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique, userFindFirst (+1 more)

### Community 129 - "scan/ui.tsx"
Cohesion: 0.13
Nodes (32): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+24 more)

### Community 130 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "employee-invitation-service.ts"
Cohesion: 0.21
Nodes (14): buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired(), createMembershipInvitation() (+6 more)

### Community 133 - "marketing-topup-route.test.ts"
Cohesion: 0.09
Nodes (17): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit (+9 more)

### Community 134 - "staff-notification-delivery.ts"
Cohesion: 0.15
Nodes (18): web-push, isValidEmailAddress(), isWebPushConfigured(), publicAppUrl(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription() (+10 more)

### Community 135 - "next"
Cohesion: 0.04
Nodes (23): nextConfig, next, dynamic, SPACES, metadata, viewport, metadata, AppNav() (+15 more)

### Community 136 - "cards-index.tsx"
Cohesion: 0.15
Nodes (17): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+9 more)

### Community 137 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 138 - "webhook/route.ts"
Cohesion: 0.32
Nodes (11): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), refundIncludedQuota() (+3 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.20
Nodes (16): ad(), approvedAd(), asAdmin(), asCustomer(), asMerchant(), ctx(), customerCard(), dataUrl() (+8 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.23
Nodes (7): adminStage(), ctx(), fake, h, jsonReq(), moderate(), propose()

### Community 143 - "staff-permissions.ts"
Cohesion: 0.18
Nodes (9): ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS, EMPLOYEE_FIXED_PERMISSIONS, MANAGER_DEFAULT, PERMISSION_KEYS, PERMISSION_LABELS, PermissionKey (+1 more)

### Community 144 - "generate-pwa-icons.mjs"
Cohesion: 0.28
Nodes (8): ref_node_buffer, ref_node_zlib, chunk(), color, crc32(), outDir, png(), root

### Community 145 - "stripe-mode.test.ts"
Cohesion: 0.22
Nodes (6): stripe, constructorKeys, envMock, FakeStripe, refundsCreate, sessionsCreate

### Community 146 - "lib/campaign-worker.ts"
Cohesion: 0.10
Nodes (29): AudienceEstimate, estimatedForChannel(), estimateNetworkLocalAudience(), networkAudienceWhere(), backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete() (+21 more)

### Community 147 - "@prisma/client"
Cohesion: 0.11
Nodes (18): @prisma/client, decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval(), activeProgram, baseMembership, customerMembershipFindFirst (+10 more)

### Community 148 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 149 - "merchant-billing.test.ts"
Cohesion: 0.24
Nodes (7): mapStripeSubscriptionStatus(), confirm(), ctxReq(), fake, h, PERIOD_END, preview()

### Community 150 - "scripts/campaign-worker.ts"
Cohesion: 0.60
Nodes (5): log(), loop(), requestShutdown(), sleep(), runAdLifecycleTick()

### Community 151 - "customer-loyalty-overview.ts"
Cohesion: 0.14
Nodes (18): activityFromWalletEvent(), ActivityItem, buildCardNextRewardEntry(), buildHistoricalRewardOverview(), buildNextRewardCandidates(), CardNextRewardEntry, CardRewardProgress, CustomerLoyaltyOverview (+10 more)

### Community 152 - "GET"
Cohesion: 0.43
Nodes (6): GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), sseChunk(), shouldSendSseEvent()

### Community 153 - "google-wallet-doctor.ts"
Cohesion: 0.52
Nodes (6): google-auth-library, accessToken(), fail(), main(), ok(), pngSize()

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.08
Nodes (32): DiscoverPage(), Merchant, DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+24 more)

### Community 155 - "send/route.ts"
Cohesion: 0.22
Nodes (11): POST(), FinalisationPage(), FinalisationForm(), createRawCustomerToken(), CUSTOMER_TOKEN_TTL, invalidateCustomerAccessTokens(), issueCustomerAccessToken(), isSmsConfigured() (+3 more)

### Community 156 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 157 - "landing-hero-visual.tsx"
Cohesion: 0.33
Nodes (5): CoffeeIcon(), QrCodeIcon(), WalletCardsIcon(), WifiIcon(), LandingHeroVisual()

### Community 158 - "statistiques-scroll.test.ts"
Cohesion: 0.33
Nodes (4): appNav, globalsCss, layoutClient, statistiquesPanel

### Community 160 - "ad-detail.tsx"
Cohesion: 0.10
Nodes (19): AdRequestDetail, AdStatus, AUDIT_LABELS, AuditRow, Delivery, Draft, Journey, PLACEMENT_LABELS (+11 more)

### Community 162 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 163 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 164 - "vitest"
Cohesion: 0.10
Nodes (18): vitest, assertEarnProgramRules(), employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw (+10 more)

### Community 165 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.15
Nodes (24): main(), AdCandidate, CustomerZone, DeliveryCheck, diagnoseAdDelivery(), evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS (+16 more)

### Community 167 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 168 - "ad-google-wallet-visual-workflow.ts"
Cohesion: 0.33
Nodes (10): AdWalletCtx, approveWalletVisualAsIs(), clearWalletVisual(), merchantRespondWalletVisual(), nextWalletNumber(), notify(), proposeWalletVisual(), WalletVersionFiles (+2 more)

### Community 169 - "landing-faq.tsx"
Cohesion: 0.40
Nodes (4): PlusIcon(), FAQ_ITEMS, FaqItem, LandingFaq()

### Community 170 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 172 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 173 - "card-template-schema.ts"
Cohesion: 0.09
Nodes (20): CardTemplateBackground(), CardEditorBackgroundCrop(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle (+12 more)

### Community 174 - "theme-toggle.tsx"
Cohesion: 0.50
Nodes (3): MoonIcon(), SunIcon(), ThemeToggle()

### Community 175 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 176 - "resolveMediaFilePath"
Cohesion: 0.38
Nodes (5): GET(), MIME, GET(), MIME, resolveMediaFilePath()

### Community 177 - "landing-header.tsx"
Cohesion: 0.67
Nodes (3): isInternalRoute(), LandingHeader(), NAV_LINKS

### Community 178 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 194 - "capture-employe-screenshots.mjs"
Cohesion: 0.67
Nodes (3): main(), outDir, shot()

## Knowledge Gaps
- **1026 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+1021 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1377 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `scan/ui.tsx`, `firstActiveStaffMembership`, `app/ui.tsx`, `ouvrir/route.ts`, `react`, `merchant-card-template-service.ts`, `loyalty-context.ts`, `cards-index.tsx`, `marketing-topup-route.test.ts`, `campaign-moderation-home.tsx`, `http.ts`, `[id]/merchant-detail.tsx`, `clients/ui.tsx`, `jsonError`, `caisse-scan-route.test.ts`, `google-auth.ts`, `hosts.ts`, `jsonOk`, `send/route.ts`, `layout-shell.tsx`, `sponsored-slot.tsx`, `loyaltyBalanceForMode`, `merchant-ad-edit.test.ts`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `vitest`, `ad-visuals.ts`, `customer-onboarding.ts`, `api-merchant-statistics-route.test.ts`, `super-admin-ad-moderation.test.ts`, `ad-visual-ui-contracts.test.ts`, `demo-session.ts`, `src/app/page.tsx`, `landing-footer.tsx`, `resolveMediaFilePath`, `landing-header.tsx`, `fife-life/merchant-detail.tsx`, `qa-login.ts`, `ref_node_path`, `wallet-home.tsx`, `app/statistiques/page.tsx`, `demo-visual.ts`, `cn`, `unsubscribe-token.ts`, `super-admin-session.ts`, `interactive-loyalty-card.tsx`, `rbac.ts`, `session.ts`, `campagnes/ui.tsx`, `profile-page.tsx`, `merchant-ui.tsx`, `tarifs/page.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `employee-session.ts`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `loyalty-context.ts`, `merchant-card-template-service.ts`, `ouvrir/route.ts`, `employee-invitation-service.ts`, `loyalty-program.ts`, `merchant-billing.ts`, `cards-index.tsx`, `staff-notification-delivery.ts`, `loyalty-widget.ts`, `card-editor-canvas.tsx`, `api-guard.ts`, `customer-reward-progress.ts`, `http.ts`, `staff-permissions.ts`, `lib/campaign-worker.ts`, `prisma`, `jsonError`, `super-admin.test.ts`, `customer-loyalty-overview.ts`, `google-auth.ts`, `google-wallet.ts`, `jsonOk`, `send/route.ts`, `ad-visual-parts.tsx`, `prisma.ts`, `programme/ui.tsx`, `ad-detail.tsx`, `package.json`, `card-editor.tsx`, `campaign-lifecycle.ts`, `customer-onboarding.ts`, `sponsored-selection.ts`, `ad-google-wallet-visual-workflow.ts`, `card-editor-properties.tsx`, `create-super-admin.ts`, `loyalty-service.ts`, `card-template-schema.ts`, `loyalty-program-publication.ts`, `fife-life/merchant-detail.tsx`, `qa-login.ts`, `insight-stats.ts`, `sponsored-test-broadcast.ts`, `wallet-home.tsx`, `platform-stats.ts`, `WalletHome`, `ad-detail-wallet-panel.tsx`, `merchant-card-renderer.tsx`, `cn`, `loyalty-commit.ts`, `requireMerchantAdmin`, `super-admin-session.ts`, `rbac.ts`, `session.ts`, `money.ts`, `profile-page.tsx`, `env.ts`, `wallet-unlock.ts`, `qr.ts`, `employee-session.ts`, `cashier-checkout.tsx`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `loyalty-context.ts`, `merchant-card-template-service.ts`, `ouvrir/route.ts`, `react`, `loyalty-program.ts`, `google-wallet/route.ts`, `loyalty-widget-view.tsx`, `loyalty-widget.ts`, `card-editor-canvas.tsx`, `customer-reward-progress.ts`, `super-admin.test.ts`, `google-auth.ts`, `hosts.ts`, `sponsored-placements.test.ts`, `prisma.ts`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `customer-onboarding.ts`, `stripe-webhook-marketing.test.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `loyalty-service.ts`, `demo-session.ts`, `card-editor-polish.test.ts`, `loyalty-program-publication.ts`, `qa-login.ts`, `ref_node_path`, `stripe.ts`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `sponsored-test-broadcast.ts`, `wallet-home.tsx`, `app/statistiques/page.tsx`, `platform-stats.ts`, `card-deck.tsx`, `ref_fs`, `WalletHome`, `stripe-webhook-route.test.ts`, `fake-ad-db.ts`, `merchant-card-renderer.tsx`, `qr-cache.ts`, `unsubscribe-token.ts`, `requireMerchantAdmin`, `app/app/connexion/page.tsx`, `super-admin-session.ts`, `rbac.ts`, `ad-visual-journeys.test.ts`, `money.ts`, `profile-page.tsx`, `[kind]/route.ts`, `apply-ad-visual-crop.ts`, `campaign-worker.test.ts`, `tarifs/page.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `wallet-unlock.ts`, `campaign-confirm-route.test.ts`, `qr.ts`, `caisse-client-number.test.ts`, `scan/ui.tsx`, `employee-invitation-service.ts`, `marketing-topup-route.test.ts`, `staff-notification-delivery.ts`, `next`, `landing-page.test.ts`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `stripe-mode.test.ts`, `lib/campaign-worker.ts`, `@prisma/client`, `caisse-scan-route.test.ts`, `merchant-billing.test.ts`, `customer-loyalty-overview.ts`, `merchant-ad-edit.test.ts`, `statistiques-scroll.test.ts`, `campaign-audience.test.ts`, `caisse-scan.test.ts`, `campaign-lifecycle.ts`, `marketing-balance.test.ts`, `api-merchant-statistics-route.test.ts`, `super-admin-ad-moderation.test.ts`, `ad-visual-ui-contracts.test.ts`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _1026 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `loyalty-context.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1178743961352657 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05251141552511415 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07701863354037267 - nodes in this community are weakly interconnected._