# Graph Report - Cartefidelité  (2026-10-04)

## Corpus Check
- 747 files · ~4,843,020 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 4129 nodes · 13000 edges · 175 communities (147 shown, 28 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b9bce96c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scan/route.ts
- loyalty-program.ts
- rbac.ts
- merchant-card-template-service.ts
- click/route.ts
- react
- loyalty-commit.ts
- merchant-billing.ts
- google-wallet/route.ts
- card-template-schema.ts
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-properties.tsx
- prisma.ts
- customer-reward-progress.ts
- rateLimit
- google-wallet.ts
- [id]/merchant-detail.tsx
- merchant/ads/route.ts
- clients/ui.tsx
- requireUser
- super-admin.test.ts
- jsonOk
- google-auth.ts
- env.ts
- requireMutatingRequest
- solde/ui.tsx
- ad-visual-parts.tsx
- jsonError
- session.ts
- employees/[id]/route.ts
- @prisma/client
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
- insight-period.ts
- LoyaltyError
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- qr-cache.ts
- loyalty-program-publication.ts
- send/route.ts
- qa-login.ts
- ref_node_path
- dependencies
- stripe.ts
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- sponsored-test-broadcast.ts
- sponsored-placements.test.ts
- MerchantCampaignFiche
- scripts
- facturation/ui.tsx
- platform-stats.ts
- next
- wallet-home.tsx
- vitest
- AdDetailPage
- stripe-webhook-route.test.ts
- fake-ad-db.ts
- campaign-en-cours.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- advantages-ui.tsx
- sponsored-hours-pricing.ts
- customer-layout-guard.ts
- profile-page.tsx
- ads/[id]/confirm/route.ts
- app/app/connexion/page.tsx
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- interactive-loyalty-card.tsx
- campaign-moderation-home.tsx
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- caisse-scan.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- [kind]/route.ts
- lib/campaign-worker.ts
- EmployeeDetailPanel
- sponsored-test-broadcast.test.ts
- ad-detail-wallet-panel.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- firstActiveStaffMembership
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- loyalty-reward-removal.ts
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- employee-access.test.ts
- ad-confirm-route.test.ts
- events/route.ts
- campaign-confirm-route.test.ts
- qr.ts
- employee-session.ts
- create-super-admin.ts
- HourlySchedulePicker
- CampaignWizard
- scan/ui.tsx
- MerchantDetailPage
- app/ui.tsx
- employee-invitation-service.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- layout-client.tsx
- landing-page.test.ts
- webhook/route.ts
- push-client.ts
- notifications-center.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- marketing-balance/route.ts
- customer-qr.ts
- loyalty-service.test.ts
- scripts/campaign-worker.ts
- customer-loyalty-overview.ts
- sponsored-slot.tsx
- finalisation/page.tsx
- merchant-ad-edit.test.ts
- campaign-quota.test.ts
- ad-detail.tsx
- customer-notifications-route.test.ts
- caisse-scan.test.ts
- customer-preferences-route.test.ts
- marketing-balance.test.ts
- sponsored-selection.ts
- api-merchant-statistics-route.test.ts
- staff-notification-delivery.ts
- super-admin-ad-moderation.test.ts
- customer-push-route.test.ts
- CreateMerchantWizard
- avatar-storage.ts
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

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 269 edges
2. `jsonOk()` - 235 edges
3. `requireMutatingRequest()` - 171 edges
4. `next` - 161 edges
5. `prisma` - 154 edges
6. `vitest` - 131 edges
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
- `main()` --calls--> `isGoogleWalletConfigured()`  [EXTRACTED]
  scripts/diagnose-google-wallet-campaign-hero.ts → src/lib/env.ts
- `main()` --calls--> `getGoogleWalletLoyaltyObject()`  [EXTRACTED]
  scripts/diagnose-google-wallet-campaign-hero.ts → src/lib/google-wallet.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (175 total, 28 thin omitted)

### Community 0 - "scan/route.ts"
Cohesion: 0.19
Nodes (13): logScanBody(), POST(), scanVia(), CaisseScanError, maskClientNumberForLog(), processCaisseScanByClientNumber(), publicQrErrorMessage(), processCaisseScan (+5 more)

### Community 1 - "loyalty-program.ts"
Cohesion: 0.10
Nodes (44): buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), ActiveMerchantLoyaltyContext, isMerchantOperational(), isProgramOperational(), logContext() (+36 more)

### Community 2 - "rbac.ts"
Cohesion: 0.09
Nodes (31): CaissePage(), DashboardLayout(), MerchantHomePage(), heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), DEMO_MERCHANT, hasMerchantStaffAccess() (+23 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.05
Nodes (63): GET(), GET(), LegacyCardEditorRedirect(), CardEditorVariantRoute(), MerchantCardsGallery(), slotStatusLabel(), slotTone(), statusBadgeClass() (+55 more)

### Community 4 - "click/route.ts"
Cohesion: 0.22
Nodes (8): GET(), computeAdLifecycleStatus(), isSafeAdUrl(), AdForWorkflow, isWithinUtcIntervals(), UtcInterval, adEventCreate, adRequestFindUnique

### Community 5 - "react"
Cohesion: 0.05
Nodes (53): react, DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), Merchant (+45 more)

### Community 6 - "loyalty-commit.ts"
Cohesion: 0.09
Nodes (49): assertEarnProgramRules(), appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive() (+41 more)

### Community 7 - "merchant-billing.ts"
Cohesion: 0.11
Nodes (28): GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult, listMerchantInvoices() (+20 more)

### Community 8 - "google-wallet/route.ts"
Cohesion: 0.15
Nodes (23): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+15 more)

### Community 9 - "card-template-schema.ts"
Cohesion: 0.06
Nodes (47): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+39 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (40): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, missingWidgetLabel(), publishValidationResult(), summarizeEditorValidation() (+32 more)

### Community 11 - "validation.ts"
Cohesion: 0.05
Nodes (42): zod, deleteSchema, bodySchema, cropStateSchema, createMerchantFullSchema, merchantDeleteSchema, merchantStatusActionSchema, reauthSchema (+34 more)

### Community 12 - "VisualPicker"
Cohesion: 0.31
Nodes (11): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onFidetoFilesSelected(), onSelfFileSelected() (+3 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (67): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+59 more)

### Community 14 - "prisma.ts"
Cohesion: 0.07
Nodes (40): GET(), FILTER_MAP, GET(), dynamic, LOYALTY_MODES, GET(), PERIOD_KEYS, schema (+32 more)

### Community 15 - "customer-reward-progress.ts"
Cohesion: 0.11
Nodes (24): buildTargetView(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState, progressLineForTarget(), LoyaltyUnit (+16 more)

### Community 16 - "rateLimit"
Cohesion: 0.09
Nodes (39): POST(), schema, POST(), POST(), schema, GET(), POST(), POST() (+31 more)

### Community 17 - "google-wallet.ts"
Cohesion: 0.10
Nodes (58): isGoogleWalletConfigured(), accessToken(), appLinkData(), assertConfigured(), availableRewardModules(), buildGoogleWalletIds(), buildGoogleWalletMerchantView(), cardUrl() (+50 more)

### Community 18 - "[id]/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+10 more)

### Community 19 - "merchant/ads/route.ts"
Cohesion: 0.29
Nodes (13): POST(), POST(), schema, POST(), notifySuperAdmin(), setAdSources(), submitMerchantVersion(), adVisualFileSize() (+5 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.13
Nodes (16): ClientsPage(), Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx (+8 more)

### Community 21 - "requireUser"
Cohesion: 0.09
Nodes (34): DELETE(), GET(), dynamic, GET(), dynamic, GET(), GET(), markReadSchema (+26 more)

### Community 22 - "super-admin.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 23 - "jsonOk"
Cohesion: 0.12
Nodes (31): POST(), GET(), GET(), GET(), GET(), GET(), PATCH(), GET() (+23 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.11
Nodes (29): GET(), GET(), CustomerLoginPage(), CustomerSignupPage(), CustomerSignupForm(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl() (+21 more)

### Community 25 - "env.ts"
Cohesion: 0.07
Nodes (33): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), dynamic, robots() (+25 more)

### Community 26 - "requireMutatingRequest"
Cohesion: 0.11
Nodes (60): POST(), POST(), POST(), POST(), POST(), GET(), POST(), POST() (+52 more)

### Community 27 - "solde/ui.tsx"
Cohesion: 0.16
Nodes (15): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, estimateSponsorPricing() (+7 more)

### Community 28 - "ad-visual-parts.tsx"
Cohesion: 0.12
Nodes (20): AdStatus, Detail, HistoryRow, PaymentPreview, PayMethod, STATUS_LABELS, block, formatDateTime() (+12 more)

### Community 29 - "jsonError"
Cohesion: 0.07
Nodes (48): GET(), PATCH(), GET(), POST(), POST(), POST(), schema, GET() (+40 more)

### Community 30 - "session.ts"
Cohesion: 0.09
Nodes (31): GET(), dynamic, MerchantProfilePage(), CarteIdentitePage(), AccountPage(), dynamic, NotificationsPage(), ProEntryPage() (+23 more)

### Community 31 - "employees/[id]/route.ts"
Cohesion: 0.16
Nodes (20): GET(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST() (+12 more)

### Community 32 - "@prisma/client"
Cohesion: 0.07
Nodes (29): @prisma/client, DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward() (+21 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.08
Nodes (48): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+40 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.12
Nodes (22): CoverCropEditor(), onHandlePointerDown(), move(), up(), onWheel(), CoverCropEditorSpec, GoogleWalletMediaCrop(), confirm() (+14 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.10
Nodes (35): GET(), GET(), fileUrlFromMediaPath(), isGoogleWalletHeroFilename(), isPublicGoogleWalletHeroMedia(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES (+27 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.11
Nodes (34): createRawCustomerToken(), CUSTOMER_TOKEN_TTL, invalidateCustomerAccessTokens(), issueCustomerAccessToken(), beginCustomerOnboarding(), buildAccountRecoveryUrl(), buildEmailVerificationUrl(), CustomerAccessLevel (+26 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.11
Nodes (30): GET(), MIME, GET(), MIME, appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCampaignMedia(), deleteCardBackground() (+22 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "insight-period.ts"
Cohesion: 0.23
Nodes (20): addParisDays(), addParisMonths(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey, PARIS_TZ (+12 more)

### Community 44 - "LoyaltyError"
Cohesion: 0.40
Nodes (7): GET(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), computeLoyalty(), LoyaltyError, LoyaltySnapshot

### Community 45 - "demo-session.ts"
Cohesion: 0.10
Nodes (25): GET(), GET(), GET(), GET(), GET(), CLIENT_DEMO_COOKIE, isClientDemoMode(), isDemoCookie() (+17 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.06
Nodes (42): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+34 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "qr-cache.ts"
Cohesion: 0.07
Nodes (49): QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr(), getCachedQr(), getPersonalizedQr(), inflight (+41 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.15
Nodes (22): GET(), activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS (+14 more)

### Community 50 - "send/route.ts"
Cohesion: 0.16
Nodes (17): POST(), POST(), POST(), schema, POST(), DELETE(), GET(), parseUserAgent() (+9 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (36): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken() (+28 more)

### Community 52 - "ref_node_path"
Cohesion: 0.03
Nodes (50): ref_node_buffer, ref_node_fs, ref_node_path, ref_node_url, ref_node_zlib, playwright, outDir, pages (+42 more)

### Community 53 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+12 more)

### Community 54 - "stripe.ts"
Cohesion: 0.09
Nodes (31): stripe, BillingCustomerInput, billingParams(), CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, createBillingPortalSession() (+23 more)

### Community 55 - "email.ts"
Cohesion: 0.17
Nodes (26): nodemailer, ContactPage(), buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput, emailConfigHint() (+18 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.10
Nodes (36): bucketKey(), enumerateBucketKeys(), InsightRange, buildCohorts(), buildComparison(), buildFinancial(), buildFrequentation(), buildOverview() (+28 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.12
Nodes (9): MobilePlacementPreview(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer, observers (+1 more)

### Community 59 - "sponsored-test-broadcast.ts"
Cohesion: 0.14
Nodes (28): main(), probePublicImage(), redactUrl(), approvedGoogleWalletHeroUrl(), isDedicatedWalletHeroStorageUrl(), resolveApprovedWalletHeroForGoogle(), resolveCampaignModuleHeroPathOrUrl(), buildGlobalWalletValueAddedModule() (+20 more)

### Community 60 - "sponsored-placements.test.ts"
Cohesion: 0.16
Nodes (16): GET(), previewResponse(), withResolvedImage(), resolveSponsoredImageUrl(), loadAdPreviewCard(), parsePlacement(), selectSponsoredForCustomer(), click() (+8 more)

### Community 61 - "MerchantCampaignFiche"
Cohesion: 0.19
Nodes (16): api(), euros(), MerchantCampaignFiche(), addSources(), onFile(), post(), onFileChosen(), AdDetailWalletPanel() (+8 more)

### Community 62 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, diagnose:wallet-hero (+7 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.23
Nodes (15): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+7 more)

### Community 65 - "next"
Cohesion: 0.08
Nodes (14): nextConfig, next, CaisseAliasPage(), dynamic, metadata, viewport, EmployeeHomePage(), EmployeeScanPage() (+6 more)

### Community 66 - "wallet-home.tsx"
Cohesion: 0.06
Nodes (49): motion, react-dom, AddToGoogleWalletButton(), activeCardFromDeck(), CardDeck(), handleDragEnd(), handleKeyDown(), snapTo() (+41 more)

### Community 67 - "vitest"
Cohesion: 0.06
Nodes (24): ref_fs, ref_path, vitest, main(), outDir, shot(), outDir, main() (+16 more)

### Community 68 - "AdDetailPage"
Cohesion: 0.22
Nodes (14): AdDetailPage(), confirmBannerCrop(), confirmReason(), patch(), requestSend(), run(), sendProposal(), startTestBroadcast() (+6 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "fake-ad-db.ts"
Cohesion: 0.13
Nodes (18): END, fake, h, previewCall(), START, END, fake, START (+10 more)

### Community 71 - "campaign-en-cours.ts"
Cohesion: 0.15
Nodes (13): CampagnesPanel(), statusTone(), AD_EN_COURS, AdEnCoursInput, ANNOUNCE_EN_COURS, CampaignEnCoursInput, isCampaignEnCours(), isSponsoredAdLiveNow() (+5 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.10
Nodes (36): CardTemplateBackground(), COMPACT_HIDDEN, elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRendererProps, resolveDisplayQrSrc(), shouldHideElement() (+28 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "advantages-ui.tsx"
Cohesion: 0.15
Nodes (17): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+9 more)

### Community 75 - "sponsored-hours-pricing.ts"
Cohesion: 0.18
Nodes (11): slotAmountCents(), parisHourInstant(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, parisSlotEnd(), rateForParisHour(), SPONSORED_HOUR_RATE_CENTS (+3 more)

### Community 76 - "customer-layout-guard.ts"
Cohesion: 0.33
Nodes (7): CarteLayout(), CompteLayout(), NotificationsLayout(), enforceCustomerWalletAccess(), customerWalletGuardRedirect(), isFinalizationAllowedPath(), runCustomerOnboardingSideEffects()

### Community 77 - "profile-page.tsx"
Cohesion: 0.05
Nodes (45): next-themes, src_app_globals, dynamic, manrope, metadata, viewport, AvatarFileInput(), AvatarPreviewEditor() (+37 more)

### Community 78 - "ads/[id]/confirm/route.ts"
Cohesion: 0.13
Nodes (39): billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, POST() (+31 more)

### Community 79 - "app/app/connexion/page.tsx"
Cohesion: 0.39
Nodes (6): AppLoginPage(), formatEurosFromCents(), isMerchantPlanId(), MERCHANT_PLANS, MerchantPlan, MerchantPlanId

### Community 80 - "super-admin-session.ts"
Cohesion: 0.04
Nodes (53): recharts, SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), DiagnosticPage() (+45 more)

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
Cohesion: 0.14
Nodes (17): InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, formatClientNumberDisplay(), DEMO_TIER_DECK_ORDER, getLoyaltyCardBackground(), getLoyaltyCardTierLabel(), LOYALTY_CARD_BACKGROUNDS, LOYALTY_CARD_TIER_LABELS (+9 more)

### Community 85 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.13
Nodes (16): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, fetchFile(), h (+8 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "caisse-scan.ts"
Cohesion: 0.10
Nodes (35): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, buildScanResult() (+27 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (21): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+13 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "[kind]/route.ts"
Cohesion: 0.24
Nodes (5): ref_os, GET(), notFound(), loadRoute(), PNG_BYTES

### Community 102 - "lib/campaign-worker.ts"
Cohesion: 0.08
Nodes (35): jose, backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick() (+27 more)

### Community 103 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 104 - "sponsored-test-broadcast.test.ts"
Cohesion: 0.22
Nodes (8): adFindUnique, adRow, broadcastDelete, broadcastFindUnique, broadcastUpdate, broadcastUpsert, syncAll, walletCount

### Community 105 - "ad-detail-wallet-panel.tsx"
Cohesion: 0.17
Nodes (14): sharp, Props, VERSION_STATUS, WalletVersion, src_app_super_admin_campagnes_fiche_id_fiche_module, WALLET_VISUAL_STATUS_LABELS, renderAdVisualCrop(), AD_GOOGLE_WALLET_HERO_CROP_SPEC (+6 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "firstActiveStaffMembership"
Cohesion: 0.13
Nodes (24): CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), CustomerDetailPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), FidelisationPanel() (+16 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "loyalty-reward-removal.ts"
Cohesion: 0.47
Nodes (4): decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval()

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "employee-access.test.ts"
Cohesion: 0.70
Nodes (3): employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie()

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "events/route.ts"
Cohesion: 0.20
Nodes (13): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), shouldSendSseEvent() (+5 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "qr.ts"
Cohesion: 0.25
Nodes (11): main(), prisma, requiredEnv(), upsertEmployee(), processCaisseScan(), assertQrUsable(), QrError, QrPayload (+3 more)

### Community 125 - "employee-session.ts"
Cohesion: 0.11
Nodes (23): EmployeeLoginPage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS, cookieOptions() (+15 more)

### Community 126 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 127 - "HourlySchedulePicker"
Cohesion: 0.22
Nodes (14): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotsToHours() (+6 more)

### Community 129 - "scan/ui.tsx"
Cohesion: 0.05
Nodes (69): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+61 more)

### Community 130 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "employee-invitation-service.ts"
Cohesion: 0.16
Nodes (20): GET(), POST(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate() (+12 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "push.ts"
Cohesion: 0.31
Nodes (7): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), WebPushNotConfiguredError

### Community 135 - "layout-client.tsx"
Cohesion: 0.21
Nodes (8): DashboardLayout(), AppNav(), icons, isActive(), TOOLS_PREFIXES, BellItem, formatWhen(), NotificationBell()

### Community 137 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 138 - "webhook/route.ts"
Cohesion: 0.20
Nodes (17): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), isCancellable() (+9 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "notifications-center.tsx"
Cohesion: 0.14
Nodes (11): DiscoverPage(), Merchant, DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+3 more)

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.25
Nodes (13): approvedAd(), asAdmin(), asMerchant(), ctx(), dataUrl(), fake, futureSchedule(), h (+5 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.23
Nodes (7): adminStage(), ctx(), fake, h, jsonReq(), moderate(), propose()

### Community 143 - "marketing-balance/route.ts"
Cohesion: 0.13
Nodes (17): POST(), topupSchema, resolveAppOriginFromRequestHost(), isValidTopupAmountCents(), MAX_TOPUP_CENTS, MIN_TOPUP_CENTS, TOPUP_PRESETS_CENTS, createMarketingTopupCheckoutSession() (+9 more)

### Community 144 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 150 - "scripts/campaign-worker.ts"
Cohesion: 0.60
Nodes (5): log(), loop(), requestShutdown(), sleep(), runAdLifecycleTick()

### Community 151 - "customer-loyalty-overview.ts"
Cohesion: 0.09
Nodes (33): CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel() (+25 more)

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.13
Nodes (22): src_components_fife_life_sponsored_banner_sponsoredad, SponsoredBanner(), src_components_fife_life_sponsored_banner_sponsoredvariant, isExternalUrl(), SponsoredAd, SponsoredOfferCard(), navigate(), onCardClick() (+14 more)

### Community 155 - "finalisation/page.tsx"
Cohesion: 0.27
Nodes (6): FinalisationPage(), FinalisationForm(), isSmsConfigured(), sendSms(), smsConfigHint(), SmsSendResult

### Community 156 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 158 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 160 - "ad-detail.tsx"
Cohesion: 0.10
Nodes (19): AdRequestDetail, AdStatus, AUDIT_LABELS, AuditRow, Delivery, Draft, Journey, PLACEMENT_LABELS (+11 more)

### Community 161 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 162 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 164 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 165 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.12
Nodes (27): main(), GET(), AdCandidate, CustomerZone, DeliveryCheck, diagnoseAdDelivery(), evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS (+19 more)

### Community 167 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 168 - "staff-notification-delivery.ts"
Cohesion: 0.17
Nodes (19): AdWalletCtx, approveWalletVisualAsIs(), clearWalletVisual(), merchantRespondWalletVisual(), nextWalletNumber(), notify(), proposeWalletVisual(), WalletVersionFiles (+11 more)

### Community 170 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 171 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 172 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 176 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

## Knowledge Gaps
- **1033 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+1028 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1385 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `scan/route.ts`, `scan/ui.tsx`, `rbac.ts`, `app/ui.tsx`, `click/route.ts`, `react`, `merchant-card-template-service.ts`, `layout-client.tsx`, `super-admin-campaign-moderation.test.ts`, `notifications-center.tsx`, `prisma.ts`, `marketing-balance/route.ts`, `rateLimit`, `[id]/merchant-detail.tsx`, `clients/ui.tsx`, `requireUser`, `customer-loyalty-overview.ts`, `google-auth.ts`, `env.ts`, `requireMutatingRequest`, `finalisation/page.tsx`, `merchant-ad-edit.test.ts`, `session.ts`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `@prisma/client`, `customer-notifications-route.test.ts`, `ad-visuals.ts`, `sponsored-selection.ts`, `api-merchant-statistics-route.test.ts`, `customer-preferences-route.test.ts`, `media-storage.ts`, `super-admin-ad-moderation.test.ts`, `customer-push-route.test.ts`, `demo-session.ts`, `src/app/page.tsx`, `qa-login.ts`, `ref_node_path`, `wallet-home.tsx`, `vitest`, `advantages-ui.tsx`, `customer-layout-guard.ts`, `profile-page.tsx`, `super-admin-session.ts`, `campaign-moderation-home.tsx`, `caisse-scan.ts`, `campagnes/ui.tsx`, `lib/campaign-worker.ts`, `firstActiveStaffMembership`, `campaign-crud-routes.test.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `employee-session.ts`?**
  _High betweenness centrality (0.192) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `scan/ui.tsx`, `rbac.ts`, `merchant-card-template-service.ts`, `click/route.ts`, `loyalty-program.ts`, `employee-invitation-service.ts`, `loyalty-commit.ts`, `merchant-billing.ts`, `webhook/route.ts`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `prisma.ts`, `customer-reward-progress.ts`, `rateLimit`, `customer-qr.ts`, `google-wallet.ts`, `marketing-balance/route.ts`, `loyalty-service.test.ts`, `requireUser`, `super-admin.test.ts`, `jsonOk`, `customer-loyalty-overview.ts`, `google-auth.ts`, `requireMutatingRequest`, `ad-visual-parts.tsx`, `jsonError`, `session.ts`, `employees/[id]/route.ts`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `customer-onboarding.ts`, `sponsored-selection.ts`, `staff-notification-delivery.ts`, `qr-cache.ts`, `loyalty-program-publication.ts`, `send/route.ts`, `qa-login.ts`, `insight-stats.ts`, `sponsored-test-broadcast.ts`, `platform-stats.ts`, `wallet-home.tsx`, `merchant-card-renderer.tsx`, `advantages-ui.tsx`, `profile-page.tsx`, `ads/[id]/confirm/route.ts`, `super-admin-session.ts`, `caisse-scan.ts`, `lib/campaign-worker.ts`, `ad-detail-wallet-panel.tsx`, `loyalty-reward-removal.ts`, `events/route.ts`, `qr.ts`, `employee-session.ts`, `create-super-admin.ts`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `scan/route.ts`, `loyalty-program.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `click/route.ts`, `react`, `loyalty-commit.ts`, `merchant-billing.ts`, `google-wallet/route.ts`, `card-template-schema.ts`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `customer-reward-progress.ts`, `super-admin.test.ts`, `google-auth.ts`, `env.ts`, `employees/[id]/route.ts`, `card-editor.tsx`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `ad-visuals.ts`, `customer-onboarding.ts`, `stripe-webhook-marketing.test.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `insight-period.ts`, `LoyaltyError`, `demo-session.ts`, `qr-cache.ts`, `loyalty-program-publication.ts`, `qa-login.ts`, `ref_node_path`, `stripe.ts`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `sponsored-test-broadcast.ts`, `sponsored-placements.test.ts`, `platform-stats.ts`, `wallet-home.tsx`, `stripe-webhook-route.test.ts`, `fake-ad-db.ts`, `campaign-en-cours.ts`, `merchant-card-renderer.tsx`, `profile-page.tsx`, `ads/[id]/confirm/route.ts`, `app/app/connexion/page.tsx`, `super-admin-session.ts`, `ad-visual-journeys.test.ts`, `caisse-scan.ts`, `[kind]/route.ts`, `lib/campaign-worker.ts`, `sponsored-test-broadcast.test.ts`, `ad-detail-wallet-panel.tsx`, `campaign-worker.test.ts`, `loyalty-reward-removal.ts`, `campaign-crud-routes.test.ts`, `employee-access.test.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `qr.ts`, `employee-session.ts`, `scan/ui.tsx`, `employee-invitation-service.ts`, `super-admin-campaign-moderation.test.ts`, `landing-page.test.ts`, `webhook/route.ts`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `marketing-balance/route.ts`, `loyalty-service.test.ts`, `customer-loyalty-overview.ts`, `merchant-ad-edit.test.ts`, `campaign-quota.test.ts`, `customer-notifications-route.test.ts`, `caisse-scan.test.ts`, `customer-preferences-route.test.ts`, `marketing-balance.test.ts`, `api-merchant-statistics-route.test.ts`, `staff-notification-delivery.ts`, `super-admin-ad-moderation.test.ts`, `customer-push-route.test.ts`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _1033 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `loyalty-program.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09701928696668614 - nodes in this community are weakly interconnected._
- **Should `rbac.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05189873417721519 - nodes in this community are weakly interconnected._