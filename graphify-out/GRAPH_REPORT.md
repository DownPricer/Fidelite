# Graph Report - Cartefidelité  (2026-10-03)

## Corpus Check
- 723 files · ~4,807,760 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 4023 nodes · 12562 edges · 194 communities (162 shown, 32 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `10f164c2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- @prisma/client
- next
- merchant-card-template-service.ts
- click/route.ts
- react
- loyalty-commit.ts
- merchant-billing.ts
- google-wallet/route.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-canvas.tsx
- jsonOk
- customer-reward-progress.ts
- loyaltyUnitForMode
- insight-period.ts
- [id]/merchant-detail.tsx
- ad-visual-workflow.ts
- clients/ui.tsx
- jsonError
- merchant-card-finish.test.ts
- google-wallet.ts
- google-auth.ts
- hosts.ts
- requireMutatingRequest
- prisma.ts
- fiche.tsx
- sponsored-placements.test.ts
- customer-loyalty-overview.ts
- employees/[id]/route.ts
- programme/ui.tsx
- card-editor.tsx
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- requireMerchantAdmin
- customer-onboarding.ts
- What You Must Do When Invoked
- stripe-webhook-marketing.test.ts
- media-storage.ts
- loyalty-commit.test.ts
- solde/ui.tsx
- loyalty-service.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- WalletHome
- program/route.ts
- card-editor-properties.tsx
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
- AdDetailPage
- scripts
- facturation/ui.tsx
- platform-stats.ts
- demo-routing.test.ts
- card-deck.tsx
- vitest
- globalObjectBody
- stripe-webhook-route.test.ts
- fake-ad-db.ts
- demo-visual.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- cn
- qr-cache.ts
- lib/campaign-worker.ts
- marketing-topup-route.test.ts
- ads/[id]/confirm/route.ts
- app/app/connexion/page.tsx
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- MerchantCampaignFiche
- stripe-mode.ts
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- isGoogleSignInEnabled
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- cashier-checkout.tsx
- loyalty-rewards.ts
- profile-page.tsx
- google-wallet-media-route.test.ts
- generate-pwa-icons.mjs
- graphify reference: query, path, explain
- campaign-worker.test.ts
- layout-client.tsx
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
- use-wallet-unlock-animation.ts
- campaign-confirm-route.test.ts
- qr.ts
- employee-session.ts
- sponsored-hours-pricing.ts
- HourlySchedulePicker
- caisse-client-number.test.ts
- scan/ui.tsx
- EmployeeDetailPanel
- app/ui.tsx
- employee-invitation-service.ts
- super-admin-campaign-moderation.test.ts
- MerchantDetailPage
- employe/layout.tsx
- cards-index.tsx
- landing-page.test.ts
- webhook/route.ts
- push-client.ts
- campaign-moderation-home.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- staff-permissions.ts
- qa-login/page.tsx
- caisse-scan-route.test.ts
- campaign-test-mode-isolation.test.ts
- loyalty-service.test.ts
- notifications-center.tsx
- merchant-billing.test.ts
- scripts/campaign-worker.ts
- fife-life/merchant-detail.tsx
- CreateMerchantWizard
- google-wallet-doctor.ts
- sponsored-slot.tsx
- session.ts
- merchant-ad-edit.test.ts
- CampagnesPanel
- push.ts
- campaign-audience.test.ts
- ad-detail.tsx
- customer-qr.ts
- caisse-scan.test.ts
- campaign-lifecycle.ts
- customer-preferences-route.test.ts
- marketing-balance.test.ts
- sponsored-selection.ts
- api-merchant-statistics-route.test.ts
- google-wallet-campaign-module.ts
- customer-notifications-route.test.ts
- super-admin-ad-moderation.test.ts
- customer-push-route.test.ts
- create-super-admin.ts
- card-template-schema.ts
- super-admin-ad-detail-page.test.ts
- campaign-quota.test.ts
- landing-footer.tsx
- landing-header.tsx
- landing-merchant-preview.tsx
- use-media-query.ts
- carte/avantages/page.tsx
- super-admin/layout.tsx
- theme-toggle.tsx
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
6. `vitest` - 126 edges
7. `clientIp()` - 119 edges
8. `readJson()` - 114 edges
9. `react` - 113 edges
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

## Communities (194 total, 32 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.18
Nodes (19): logScanBody(), POST(), scanVia(), buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan() (+11 more)

### Community 1 - "@prisma/client"
Cohesion: 0.13
Nodes (33): @prisma/client, dynamic, MerchantProfilePage(), formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl() (+25 more)

### Community 2 - "next"
Cohesion: 0.06
Nodes (54): nextConfig, next, CaissePage(), CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), CustomerDetailPage(), ClientsPage() (+46 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.05
Nodes (68): GET(), LegacyCardEditorRedirect(), CardEditorVariantRoute(), getPublishedCardTemplate(), defaultCardTemplateConfig(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES (+60 more)

### Community 4 - "click/route.ts"
Cohesion: 0.24
Nodes (7): GET(), computeAdLifecycleStatus(), isSafeAdUrl(), isWithinUtcIntervals(), UtcInterval, adEventCreate, adRequestFindUnique

### Community 5 - "react"
Cohesion: 0.06
Nodes (37): react, SettingsPanel(), Merchant, MerchantPublic(), CustomerLoginPage(), CustomerLoginForm(), googleMessage(), recoverMessage() (+29 more)

### Community 6 - "loyalty-commit.ts"
Cohesion: 0.08
Nodes (51): appliedTierLabel(), assembleView(), buildView(), customerName(), isMerchantActive(), isProgramActive(), loadEarnHistory(), loadRewardUsage() (+43 more)

### Community 7 - "merchant-billing.ts"
Cohesion: 0.17
Nodes (21): GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult, listMerchantInvoices() (+13 more)

### Community 8 - "google-wallet/route.ts"
Cohesion: 0.14
Nodes (24): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+16 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (35): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetView(), pct(), ProgressCircle() (+27 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.09
Nodes (43): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel(), publishValidationResult() (+35 more)

### Community 11 - "validation.ts"
Cohesion: 0.05
Nodes (44): DELETE(), deleteSchema, deleteCampaignMedia(), createMerchantFullSchema, merchantDeleteSchema, merchantStatusActionSchema, reauthSchema, acceptInvitationSchema (+36 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.10
Nodes (44): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, elementLabel(), GuideLine (+36 more)

### Community 14 - "jsonOk"
Cohesion: 0.14
Nodes (27): POST(), GET(), GET(), GET(), GET(), GET(), PATCH(), GET() (+19 more)

### Community 15 - "customer-reward-progress.ts"
Cohesion: 0.19
Nodes (17): buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState, progressLineForTarget(), evaluateCustomerRewards() (+9 more)

### Community 16 - "loyaltyUnitForMode"
Cohesion: 0.26
Nodes (9): GET(), sortOrder(), GET(), balanceFieldForUnit(), incrementBalanceData(), legacyPointsForUnitBalance(), LoyaltyBalanceFields, setActiveBalanceData() (+1 more)

### Community 17 - "insight-period.ts"
Cohesion: 0.23
Nodes (20): addParisDays(), addParisMonths(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey, PARIS_TZ (+12 more)

### Community 18 - "[id]/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+10 more)

### Community 19 - "ad-visual-workflow.ts"
Cohesion: 0.11
Nodes (28): GET(), GET(), PATCH(), GET(), AdDayStats, AdPlacementStats, AdStats, ctrOf() (+20 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "jsonError"
Cohesion: 0.05
Nodes (64): GET(), PATCH(), GET(), POST(), POST(), GET(), DELETE(), POST() (+56 more)

### Community 22 - "merchant-card-finish.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 23 - "google-wallet.ts"
Cohesion: 0.14
Nodes (38): isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue() (+30 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.14
Nodes (24): GET(), GET(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie(), encodeStateCookie(), GOOGLE_SCOPES, GoogleAuthIntent (+16 more)

### Community 25 - "hosts.ts"
Cohesion: 0.12
Nodes (29): buildAccountRecoveryUrl(), buildEmailVerificationUrl(), appOriginForPublicLinks(), assertSafeEmailLink(), canonicalOrigin(), employeeInvitationUrl(), employeeOriginForPublicLinks(), FORBIDDEN_PUBLIC_HOSTS (+21 more)

### Community 26 - "requireMutatingRequest"
Cohesion: 0.11
Nodes (64): POST(), POST(), POST(), POST(), POST(), POST(), POST(), POST() (+56 more)

### Community 27 - "prisma.ts"
Cohesion: 0.08
Nodes (44): schema, schema, POST(), schema, GET(), POST(), POST(), POST() (+36 more)

### Community 28 - "fiche.tsx"
Cohesion: 0.12
Nodes (19): AdStatus, Detail, euros(), HistoryRow, PaymentPreview, PayMethod, STATUS_LABELS, block (+11 more)

### Community 29 - "sponsored-placements.test.ts"
Cohesion: 0.15
Nodes (18): GET(), GET(), previewResponse(), withResolvedImage(), resolveSponsoredImageUrl(), isAdEligibleForCustomer(), loadAdPreviewCard(), parsePlacement() (+10 more)

### Community 30 - "customer-loyalty-overview.ts"
Cohesion: 0.11
Nodes (35): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, activityFromWalletEvent() (+27 more)

### Community 31 - "employees/[id]/route.ts"
Cohesion: 0.16
Nodes (20): GET(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), requireEmployee() (+12 more)

### Community 32 - "programme/ui.tsx"
Cohesion: 0.16
Nodes (14): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+6 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.11
Nodes (30): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+22 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "requireMerchantAdmin"
Cohesion: 0.07
Nodes (59): zod, GET(), EDITABLE_STATUSES, GET(), PATCH(), GET(), POST(), POST() (+51 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.14
Nodes (21): CarteLayout(), CompteLayout(), NotificationsLayout(), enforceCustomerWalletAccess(), CustomerAccessLevel, CustomerOnboardingUser, customerWalletGuardRedirect(), FINALIZATION_PATH_PREFIXES (+13 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.10
Nodes (32): GET(), MIME, GET(), MIME, GET(), notFound(), appearanceKeyForGoogleWalletMedia(), assertExactDimensions() (+24 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "solde/ui.tsx"
Cohesion: 0.16
Nodes (15): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, estimateSponsorPricing() (+7 more)

### Community 44 - "loyalty-service.ts"
Cohesion: 0.12
Nodes (26): GET(), AmountField(), press(), KEYS, applyAdjustment(), applyEarnVisit(), applyRedeemReward(), commitLoyaltyTransaction() (+18 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.15
Nodes (20): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), DemoRole (+12 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.09
Nodes (29): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+21 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "WalletHome"
Cohesion: 0.14
Nodes (24): useWalletEvents(), connect(), disconnect(), onVisibility(), WalletHome(), buildFifeLifeNextReward(), googleWalletEndpointForActiveCard(), resolveNextRewardForActiveCard() (+16 more)

### Community 49 - "program/route.ts"
Cohesion: 0.11
Nodes (30): loadProgram(), POST(), activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft (+22 more)

### Community 50 - "card-editor-properties.tsx"
Cohesion: 0.13
Nodes (21): CardEditorProperties(), patchRect(), REQUIRED_BY_SLOT, TEXT_TYPES, qrOverlapsOthers(), BACKGROUND_FIT_LABELS, containsForbiddenTechnicalLabel(), DATA_KEY_LABELS (+13 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.09
Nodes (36): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), GET(), POST(), QaExchangeBody, qaJson() (+28 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (36): ref_node_fs, ref_node_path, ref_node_url, playwright, outDir, pages, OUT, OUT (+28 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "stripe.ts"
Cohesion: 0.18
Nodes (17): BillingCustomerInput, billingParams(), CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, createMarketingTopupCheckoutSession(), ensureStripeCustomer() (+9 more)

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
Cohesion: 0.13
Nodes (24): GlobalWalletCampaignModule, SponsoredCard, adToSponsoredTestCard(), BroadcastAd, getSponsoredTestBroadcastAdId(), getSponsoredTestBroadcastWalletModule(), isSponsoredTestBroadcastAd(), loadSponsoredTestBroadcast() (+16 more)

### Community 60 - "wallet-home.tsx"
Cohesion: 0.08
Nodes (28): motion, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), DiscoverPage(), Merchant (+20 more)

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

### Community 65 - "demo-routing.test.ts"
Cohesion: 0.14
Nodes (14): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE (+6 more)

### Community 66 - "card-deck.tsx"
Cohesion: 0.07
Nodes (39): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+31 more)

### Community 67 - "vitest"
Cohesion: 0.07
Nodes (20): ref_fs, ref_path, vitest, main(), outDir, shot(), outDir, main() (+12 more)

### Community 68 - "globalObjectBody"
Cohesion: 0.28
Nodes (16): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData() (+8 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "fake-ad-db.ts"
Cohesion: 0.11
Nodes (20): END, fake, h, previewCall(), START, END, fake, START (+12 more)

### Community 71 - "demo-visual.ts"
Cohesion: 0.10
Nodes (29): CarteIdentitePage(), AccountPage(), ParametresPage(), dynamic, NotificationsPage(), ProEntryPage(), PREVIEW_BENEFITS, PREVIEW_HISTORY (+21 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.08
Nodes (39): LinearGauge(), MerchantCardPublicPreview(), COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer() (+31 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "cn"
Cohesion: 0.07
Nodes (37): DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), FidelisationPanel(), icons (+29 more)

### Community 75 - "qr-cache.ts"
Cohesion: 0.15
Nodes (19): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce (+11 more)

### Community 76 - "lib/campaign-worker.ts"
Cohesion: 0.13
Nodes (25): jose, bodySchema, POST(), networkAudienceWhere(), backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete() (+17 more)

### Community 77 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 78 - "ads/[id]/confirm/route.ts"
Cohesion: 0.09
Nodes (49): billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, POST() (+41 more)

### Community 79 - "app/app/connexion/page.tsx"
Cohesion: 0.39
Nodes (6): AppLoginPage(), formatEurosFromCents(), isMerchantPlanId(), MERCHANT_PLANS, MerchantPlan, MerchantPlanId

### Community 80 - "super-admin-session.ts"
Cohesion: 0.08
Nodes (28): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), Check, DiagnosticPage() (+20 more)

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

### Community 85 - "stripe-mode.ts"
Cohesion: 0.16
Nodes (11): stripe, isStripeConfigured(), KEY_PREFIXES, StripeModeValue, stripeSecretKeyFor(), testMerchantIds(), constructorKeys, envMock (+3 more)

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.14
Nodes (15): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, fetchFile(), h (+7 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "isGoogleSignInEnabled"
Cohesion: 0.33
Nodes (5): CustomerSignupPage(), CustomerSignupForm(), JoinMerchantPage(), isGoogleAuthConfigured(), isGoogleSignInEnabled()

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (21): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+13 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "cashier-checkout.tsx"
Cohesion: 0.26
Nodes (12): CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase, RewardCard(), statusClass(), commitCaisseTransaction() (+4 more)

### Community 102 - "loyalty-rewards.ts"
Cohesion: 0.19
Nodes (13): assertEarnProgramRules(), RewardConfig, evaluateReward(), parseRewardConditions(), RewardConditions, rewardIsStackable(), RewardStatus, RewardUsage (+5 more)

### Community 103 - "profile-page.tsx"
Cohesion: 0.05
Nodes (44): next-themes, src_app_globals, dynamic, manrope, metadata, viewport, AvatarFileInput(), AvatarPreviewEditor() (+36 more)

### Community 105 - "generate-pwa-icons.mjs"
Cohesion: 0.28
Nodes (8): ref_node_buffer, ref_node_zlib, chunk(), color, crc32(), outDir, png(), root

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "layout-client.tsx"
Cohesion: 0.23
Nodes (7): AppNav(), icons, isActive(), TOOLS_PREFIXES, BellItem, formatWhen(), NotificationBell()

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
Cohesion: 0.09
Nodes (17): dynamic, robots(), dynamic, sitemap(), assertSameOrigin(), CsrfError, employeeCookieName(), employeeTokenFromRequest() (+9 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "use-wallet-unlock-animation.ts"
Cohesion: 0.15
Nodes (22): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), isDocumentVisible() (+14 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "qr.ts"
Cohesion: 0.26
Nodes (10): main(), prisma, requiredEnv(), upsertEmployee(), assertQrUsable(), QrError, QrPayload, secretKey() (+2 more)

### Community 125 - "employee-session.ts"
Cohesion: 0.19
Nodes (16): EmployeeLoginPage(), canEmployeeAccess(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason() (+8 more)

### Community 126 - "sponsored-hours-pricing.ts"
Cohesion: 0.18
Nodes (11): slotAmountCents(), parisHourInstant(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, parisSlotEnd(), rateForParisHour(), SPONSORED_HOUR_RATE_CENTS (+3 more)

### Community 127 - "HourlySchedulePicker"
Cohesion: 0.22
Nodes (14): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotsToHours() (+6 more)

### Community 128 - "caisse-client-number.test.ts"
Cohesion: 0.21
Nodes (10): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken(), scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique (+2 more)

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
Cohesion: 0.18
Nodes (18): GET(), POST(), buildInvitationLink(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired() (+10 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 136 - "cards-index.tsx"
Cohesion: 0.07
Nodes (29): recharts, ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate() (+21 more)

### Community 137 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 138 - "webhook/route.ts"
Cohesion: 0.31
Nodes (10): handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), creditTopup(), constructStripeWebhookEvent() (+2 more)

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
Cohesion: 0.14
Nodes (12): ref_sharp, files, INPUT_DIR, adminStage(), createAd(), ctx(), fake, h (+4 more)

### Community 143 - "staff-permissions.ts"
Cohesion: 0.18
Nodes (9): ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS, EMPLOYEE_FIXED_PERMISSIONS, MANAGER_DEFAULT, PERMISSION_KEYS, PERMISSION_LABELS, PermissionKey (+1 more)

### Community 144 - "qa-login/page.tsx"
Cohesion: 0.38
Nodes (4): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken()

### Community 145 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 146 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 148 - "notifications-center.tsx"
Cohesion: 0.24
Nodes (8): DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter(), markOneRead(), openNotification()

### Community 149 - "merchant-billing.test.ts"
Cohesion: 0.24
Nodes (7): mapStripeSubscriptionStatus(), confirm(), ctxReq(), fake, h, PERIOD_END, preview()

### Community 150 - "scripts/campaign-worker.ts"
Cohesion: 0.60
Nodes (5): log(), loop(), requestShutdown(), sleep(), runAdLifecycleTick()

### Community 151 - "fife-life/merchant-detail.tsx"
Cohesion: 0.11
Nodes (18): AddToGoogleWalletButton(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard() (+10 more)

### Community 152 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 153 - "google-wallet-doctor.ts"
Cohesion: 0.39
Nodes (8): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl(), publicUrl()

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.15
Nodes (18): src_components_fife_life_sponsored_banner_sponsoredad, SponsoredBanner(), src_components_fife_life_sponsored_banner_sponsoredvariant, SponsoredAd, SponsoredOfferCard(), SponsoredVariant, dismissToken(), getDismissedAdIds() (+10 more)

### Community 155 - "session.ts"
Cohesion: 0.13
Nodes (22): GET(), POST(), FinalisationPage(), FinalisationForm(), createRawCustomerToken(), CUSTOMER_TOKEN_TTL, invalidateCustomerAccessTokens(), issueCustomerAccessToken() (+14 more)

### Community 156 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 157 - "CampagnesPanel"
Cohesion: 0.22
Nodes (4): audienceDisplay(), CampagnesPanel(), CampaignWizard(), statusTone()

### Community 158 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 160 - "ad-detail.tsx"
Cohesion: 0.11
Nodes (17): AdRequestDetail, AdStatus, AUDIT_LABELS, AuditRow, Delivery, Draft, Journey, PLACEMENT_LABELS (+9 more)

### Community 161 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

### Community 162 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 163 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 164 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 165 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.13
Nodes (26): main(), AdCandidate, CustomerZone, DeliveryCheck, diagnoseAdDelivery(), evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS (+18 more)

### Community 167 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 168 - "google-wallet-campaign-module.ts"
Cohesion: 0.54
Nodes (6): buildGlobalWalletValueAddedModule(), globalWalletCampaignDetailUri(), localized(), resolveGlobalWalletCampaignHeroUrl(), walletHttpsUri(), adToGlobalWalletTestModule()

### Community 169 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 170 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 171 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 172 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 173 - "card-template-schema.ts"
Cohesion: 0.10
Nodes (20): CardTemplateBackground(), CardEditorBackgroundCrop(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CARD_SCHEMA_VERSION, CardDecorativeStyle, cardElementSchema (+12 more)

### Community 174 - "super-admin-ad-detail-page.test.ts"
Cohesion: 0.40
Nodes (4): adRequestFindUnique, getSuperAdminSessionUser, notFound, redirect

### Community 175 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 176 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 177 - "landing-header.tsx"
Cohesion: 0.67
Nodes (3): isInternalRoute(), LandingHeader(), NAV_LINKS

### Community 178 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 182 - "theme-toggle.tsx"
Cohesion: 0.50
Nodes (3): MoonIcon(), SunIcon(), ThemeToggle()

## Knowledge Gaps
- **1009 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+1004 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1362 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `scan/ui.tsx`, `@prisma/client`, `app/ui.tsx`, `click/route.ts`, `react`, `merchant-card-template-service.ts`, `employe/layout.tsx`, `cards-index.tsx`, `super-admin-campaign-moderation.test.ts`, `campaign-moderation-home.tsx`, `qa-login/page.tsx`, `caisse-scan-route.test.ts`, `[id]/merchant-detail.tsx`, `clients/ui.tsx`, `jsonError`, `notifications-center.tsx`, `fife-life/merchant-detail.tsx`, `google-auth.ts`, `hosts.ts`, `prisma.ts`, `session.ts`, `sponsored-placements.test.ts`, `customer-loyalty-overview.ts`, `merchant-ad-edit.test.ts`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `customer-preferences-route.test.ts`, `requireMerchantAdmin`, `customer-onboarding.ts`, `api-merchant-statistics-route.test.ts`, `media-storage.ts`, `customer-notifications-route.test.ts`, `customer-push-route.test.ts`, `super-admin-ad-moderation.test.ts`, `demo-session.ts`, `src/app/page.tsx`, `landing-footer.tsx`, `landing-header.tsx`, `carte/avantages/page.tsx`, `super-admin/layout.tsx`, `ref_node_path`, `wallet-home.tsx`, `demo-routing.test.ts`, `card-deck.tsx`, `vitest`, `demo-visual.ts`, `merchant-card-renderer.tsx`, `cn`, `lib/campaign-worker.ts`, `marketing-topup-route.test.ts`, `super-admin-session.ts`, `campagnes/ui.tsx`, `profile-page.tsx`, `layout-client.tsx`, `tarifs/page.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `employee-session.ts`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `@prisma/client`, `next`, `merchant-card-template-service.ts`, `click/route.ts`, `react`, `loyalty-commit.ts`, `google-wallet/route.ts`, `loyalty-widget-view.tsx`, `loyalty-widget.ts`, `card-editor-canvas.tsx`, `customer-reward-progress.ts`, `loyaltyUnitForMode`, `insight-period.ts`, `merchant-card-finish.test.ts`, `google-auth.ts`, `hosts.ts`, `sponsored-placements.test.ts`, `customer-loyalty-overview.ts`, `employees/[id]/route.ts`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `customer-onboarding.ts`, `stripe-webhook-marketing.test.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `loyalty-service.ts`, `program/route.ts`, `qa-login.ts`, `ref_node_path`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `sponsored-test-broadcast.ts`, `wallet-home.tsx`, `platform-stats.ts`, `demo-routing.test.ts`, `card-deck.tsx`, `stripe-webhook-route.test.ts`, `fake-ad-db.ts`, `merchant-card-renderer.tsx`, `lib/campaign-worker.ts`, `marketing-topup-route.test.ts`, `ads/[id]/confirm/route.ts`, `app/app/connexion/page.tsx`, `stripe-mode.ts`, `ad-visual-journeys.test.ts`, `loyalty-rewards.ts`, `profile-page.tsx`, `google-wallet-media-route.test.ts`, `campaign-worker.test.ts`, `tarifs/page.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `use-wallet-unlock-animation.ts`, `campaign-confirm-route.test.ts`, `qr.ts`, `caisse-client-number.test.ts`, `scan/ui.tsx`, `employee-invitation-service.ts`, `super-admin-campaign-moderation.test.ts`, `landing-page.test.ts`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `caisse-scan-route.test.ts`, `campaign-test-mode-isolation.test.ts`, `loyalty-service.test.ts`, `merchant-billing.test.ts`, `fife-life/merchant-detail.tsx`, `merchant-ad-edit.test.ts`, `campaign-audience.test.ts`, `caisse-scan.test.ts`, `campaign-lifecycle.ts`, `customer-preferences-route.test.ts`, `marketing-balance.test.ts`, `api-merchant-statistics-route.test.ts`, `google-wallet-campaign-module.ts`, `customer-notifications-route.test.ts`, `super-admin-ad-moderation.test.ts`, `customer-push-route.test.ts`, `super-admin-ad-detail-page.test.ts`, `campaign-quota.test.ts`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `next`, `merchant-card-template-service.ts`, `click/route.ts`, `employee-invitation-service.ts`, `loyalty-commit.ts`, `merchant-billing.ts`, `cards-index.tsx`, `loyalty-widget.ts`, `card-editor-canvas.tsx`, `jsonOk`, `customer-reward-progress.ts`, `loyaltyUnitForMode`, `staff-permissions.ts`, `ad-visual-workflow.ts`, `loyalty-service.test.ts`, `jsonError`, `merchant-card-finish.test.ts`, `google-wallet.ts`, `google-auth.ts`, `session.ts`, `prisma.ts`, `customer-loyalty-overview.ts`, `employees/[id]/route.ts`, `programme/ui.tsx`, `card-editor.tsx`, `package.json`, `campaign-lifecycle.ts`, `customer-qr.ts`, `customer-onboarding.ts`, `sponsored-selection.ts`, `create-super-admin.ts`, `loyalty-service.ts`, `program/route.ts`, `card-editor-properties.tsx`, `qa-login.ts`, `insight-stats.ts`, `sponsored-test-broadcast.ts`, `wallet-home.tsx`, `platform-stats.ts`, `merchant-card-renderer.tsx`, `cn`, `lib/campaign-worker.ts`, `ads/[id]/confirm/route.ts`, `super-admin-session.ts`, `cashier-checkout.tsx`, `loyalty-rewards.ts`, `profile-page.tsx`, `use-wallet-unlock-animation.ts`, `qr.ts`, `employee-session.ts`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _1009 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `@prisma/client` be split into smaller, more focused modules?**
  _Cohesion score 0.12579281183932348 - nodes in this community are weakly interconnected._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.06359649122807018 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05359831376091539 - nodes in this community are weakly interconnected._